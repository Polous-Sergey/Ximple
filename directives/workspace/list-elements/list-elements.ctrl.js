(function () {
    'use strict';

    angular
        .module('startApp')
        .controller('listElementsCtrl', listElementsCtrl);

    listElementsCtrl.$inject = ['$scope', 'elementsModel', 'request', 'url', 'settingHelper', 'addElements', 'storage'];

    //dataServices
    function listElementsCtrl($scope, elementsModel, request, url, settingHelper, addElements, storage) {
        this.$onInit = function () {
            var vm = this;
            vm.selectTableName = "";
            vm.templates = [
                'directives/workspace/list-elements/table/table.html',
                'directives/workspace/list-elements/tableFromDataBase/tableFromDataBase.html',
                'directives/workspace/list-elements/tableFromDataBase/tableFromDataBaseSetting.html',
                'directives/workspace/list-elements/tableJoin/tableJoinPopup.html',
                'directives/workspace/list-elements/tableJoin/tableJoinSettingPopup.html',
                'directives/workspace/list-elements/grid/grid.html'
            ];
            vm.dataSetFilters = {
                filterList: ['between', 'in', 'bottom-percent', 'bottom-n', 'eq'],
                filters: [],
                flagTemplateValue: 0,
                tempFirstFilter: '',
                curentFilter: {
                    operation: '',
                    expression: '',
                    firstPropertyList: [],
                    secondPropertyList: []
                },
                changeOperator: function () {
                    switch (this.curentFilter.operation) {
                        case this.filterList[0]:
                            this.flagTemplateValue = 0;
                            console.log(1);
                            break;
                        case this.filterList[1]:
                            this.flagTemplateValue = 1;
                            this.curentFilter.secondPropertyList = [];
                            this.curentFilter.firstPropertyList = [];
                            break;
                        case this.filterList[2]:
                            this.flagTemplateValue = 0;
                            console.log(3);
                            break;
                        case this.filterList[3]:
                            this.flagTemplateValue = 0;
                            console.log(4);
                            break;
                    }
                    console.log(vm.dataSetFilters);
                },
                addInValue: function () {
                    this.curentFilter.firstPropertyList.push(this.tempFirstFilter);
                    this.tempFirstFilter = '';
                    console.log(this.curentFilter);
                },
                addFilter: function () {
                    this.filters.push(angular.copy(this.curentFilter));
                }
            };

            vm.addLabel = addLabel;
            vm.openGridPopup = openGridPopup;
            vm.addGrid = addGrid;
            vm.openCustomTablePopup = openCustomTablePopup;
            vm.openTableFromDataBasePopup = openTableFromDataBasePopup;
            vm.settingTableDataFromDataBase = settingTableDataFromDataBase;
            vm.createTableFromDataBase = createTableFromDataBase;
            vm.openJoinTablePopup = openJoinTablePopup;
            vm.openJoinTablesSettingPopup = openJoinTablesSettingPopup;
            vm.finishJoinTable = finishJoinTable;
            vm.getColumnsJoinTable = getColumnsJoinTable;
            vm.changeJoinColumn = changeJoinColumn;
            vm.selectColumnFirstTable = selectColumnFirstTable;
            vm.selectColumnSecondTable = selectColumnSecondTable;
            vm.upRowPosition = upRowPosition;
            vm.downRowPosition = downRowPosition;
            vm.selectAllRow = selectAllRow;
            vm.selectNoneRow = selectNoneRow;

            vm.backPopup = backPopup;

            vm.table = {
                column: '',
                row: ''
            };
            vm.tableColumns = [];
            vm.gridModel = {
                countColumn: 2,
                countRow: 2
            };
            vm.joinDataSet = {
                firstTable: null,
                secondTable: null,
                firstColumns: [],
                secondColumns: [],
                name: "",
                selectSecondColumn: null,
                selectFirstColumn: null
            };
            vm.fromJoinTablesList = [];
            vm.toJoinTablesList = [];
            vm.columnsJoin = [];

            function addLabel() {
                addElements.label();
            }

            function openGridPopup() {
                vm.template = vm.templates[5];
                $('#tablesModal').modal('show');
            }

            function addGrid() {
                $('#tablesModal').modal('hide');
                addElements.grid(vm.gridModel);
            }

            function openCustomTablePopup() {
                vm.template = vm.templates[0];
                $('#tablesModal').modal('show');
            }

            function openTableFromDataBasePopup() {
                vm.template = vm.templates[1];
                $('#tablesModal').modal('show');
            }

            function settingTableDataFromDataBase() {
                request.request(url.tableMetadata + vm.selectTableName, 'GET').then(function (data) {
                    console.log(data);
                    vm.tableColumns = data.data;
                    vm.tableColumns.forEach(function (item, i, arr) {
                        item.selected = true;
                        item.displayName = item.columnName;
                    });
                    vm.template = vm.templates[2];
                });
            }

            function createTableFromDataBase() {
                addElements.tableFromDataBase(vm.selectTableName, vm.tableColumns, vm.dataSetFilters.filters);
            }

            function openJoinTablePopup() {
                request.request(url.getConfigJoin, 'GET').then(function (data) {
                    console.log(data);
                    vm.fromJoinTablesList = data.data;
                });
                vm.template = vm.templates[3];
                $('#tablesModal').modal('show');
            }

            function getColumnsJoinTable(tableName, table) {
                switch (table) {
                    case 'first':
                        vm.toJoinTablesList = tableName.joinTables;
                        break;
                    case 'second':
                        createDisplayName(tableName);
                        break;
                }
                function createDisplayName(data) {
                    vm.columnsJoin = data.joinColumns;
                }
            }

            function changeJoinColumn(index) {
                vm.joinDataSet.selectFirstColumn = vm.columnsJoin[index].joinColumn;
                vm.joinDataSet.selectSecondColumn = vm.columnsJoin[index].inverseJoinColumn;
            }

            function openJoinTablesSettingPopup() {
                getColumnsTable(vm.joinDataSet.firstTable.tableName).then(function (data) {
                    vm.joinDataSet.firstColumns = data;
                }).then(function () {
                    getColumnsTable(vm.joinDataSet.secondTable.tableName).then(function (data) {
                        vm.joinDataSet.secondColumns = data;
                        vm.tableColumns.length = 0;
                        vm.tableColumns = vm.tableColumns.concat(vm.joinDataSet.firstColumns, vm.joinDataSet.secondColumns);
                        vm.template = vm.templates[4];
                    });
                });
            }
            function getColumnsTable(tableName) {
                return request.request(url.tableMetadata + tableName, 'GET').then(function (data) {
                    return createDisplayName(data.data);
                    // switch (table){
                    //     case 'first': vm.joinDataSet.firstColumns = createDisplayName(data.data);break;
                    //     case 'second': vm.joinDataSet.secondColumns = createDisplayName(data.data);break;
                    // }
                });
                function createDisplayName(data) {
                    data.forEach(function (item) {
                        item.displayName = item.columnName;
                        item.selected = true;
                    });
                    return data;
                }
            }

            function finishJoinTable() {
                vm.joinDataSet.firstTable = vm.joinDataSet.firstTable.tableName;
                vm.joinDataSet.secondTable = vm.joinDataSet.secondTable.tableName;
                addElements.tableJoin(vm.joinDataSet);
                $('#DataSetTablesModal').modal('hide');
            }

            function selectColumnFirstTable(index) {
                vm.joinDataSet.selectFirstColumn = index;
            }

            function selectColumnSecondTable(index) {
                vm.joinDataSet.selectSecondColumn = index;
            }

            function backPopup(id) {
                vm.template = vm.templates[id];
            }

            function selectAllRow(joinFlag) {
                if (joinFlag) {
                    vm.joinDataSet.firstColumns.forEach(function (item) {
                        item.selected = true;
                    });
                    vm.joinDataSet.secondColumns.forEach(function (item) {
                        item.selected = true;
                    });
                    return;
                }
                vm.tableColumns.forEach(function (item, i) {
                    item.selected = true;
                });
            }

            function selectNoneRow(joinFlag) {
                if (joinFlag) {
                    vm.joinDataSet.firstColumns.forEach(function (item) {
                        item.selected = false;
                    });
                    vm.joinDataSet.secondColumns.forEach(function (item) {
                        item.selected = false;
                    });
                    return;
                }
                vm.tableColumns.forEach(function (item, i) {
                    item.selected = false;
                });
            }

            function upRowPosition(index) {
                var tempElement = vm.tableColumns[index - 1];
                vm.tableColumns[index - 1] = vm.tableColumns[index];
                vm.tableColumns[index] = tempElement;
            }

            function downRowPosition(index) {
                var tempElement = vm.tableColumns[index + 1];
                vm.tableColumns[index + 1] = vm.tableColumns[index];
                vm.tableColumns[index] = tempElement;
            }

            active();

            function active() {
                vm.tablesList = storage.getTables();
                //vm.dataset = dataServices.dataSet;
            }
        }
    }
})();