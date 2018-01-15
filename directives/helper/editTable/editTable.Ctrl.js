(function () {
    'use strict';

    angular
        .module('startApp')
        .controller('editTableCtrl', editTableCtrl);

    editTableCtrl.$inject = ['request', 'url', 'elementsModel'];

    function editTableCtrl(request, url, elementsModel) {
        this.$onInit = function () {
            var vm = this;

            vm.newColumns = [];

            vm.deleteColumn = deleteColumn;
            vm.addColumn = addColumn;
            vm.closePopup = closePopup;

            function deleteColumn(index) {
                deleteColumnRequest(index).then(function (data) {
                    deleteColumnFromModel(index);
                });
            }

            function addColumn(index) {
                var column = vm.element.deleteColumns[index];
                var position = vm.element.tableStructure.head[0].length;
                addColumnsRequest(column, position).then(function (data) {
                    column = vm.element.deleteColumns.splice(index, 1);
                    addColumnsFromTable(data, column);
                });
            }

            function deleteColumnRequest(index) {
                var headers = {
                    'Content-Type': 'application/json'
                };
                return request.request(url.deleteColumns(vm.element.id), 'DELETE', [index], {}, headers).then(function (data) {
                    return data;
                }, function (err) {
                    console.log(err)
                });
            }

            function deleteColumnFromModel(index) {
                var column = vm.element.tableStructure.head[0].splice(index, 1)[0];
                var columnBody = vm.element.tableStructure.body[0].row.splice(index, 1)[0];
                vm.element.deleteColumns.push(column);
            }

            function addColumnsRequest(column, position) {
                var item = {
                    name: column.columnName,
                    displayName: column.displayName,
                    nativeDataType: column.nativeColumnType,
                    position: position
                };

                var headers = {
                    'Content-Type': 'application/json'
                };

                return request.request(url.addColumns(vm.element.id), 'POST', [item], headers)
                    .then(function (data) {
                        return data;
                    });
            }

            function addColumnsFromTable(data, column) {
                data.data.forEach(function (item, i) {
                    var headObj = elementsModel.tableColumn(item, column[i]);
                    vm.element.tableStructure.head[0].push(headObj.head);
                    vm.element.tableStructure.body[0].row.push(headObj.body);
                });
            }

            function closePopup() {
                $('div#edit-table').modal('hide');
            }
        }
    }
})();
