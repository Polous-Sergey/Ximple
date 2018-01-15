(function () {
    'use strict';

    angular
        .module('startApp')
        .directive('editTable', editTable);

    editTable.$inject = ['request', 'url'];

    function editTable(request, url) {
        var directive = {
            bindToController: true,
            controller: 'editTableCtrl',
            controllerAs: 'vm',
            templateUrl: 'directives/helper/editTable/editTable.html',
            link: link,
            restrict: 'E',
            replace: true,
            scope: {
                element: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {
            scope.vm.element.deleteColumns.forEach(function (item) {
                item.displayName = item.columnName;
            })
        }
    }
})();