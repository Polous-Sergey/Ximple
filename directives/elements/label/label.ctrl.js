(function () {
    'use strict';

    angular
        .module('startApp')
        .controller('labelCtrl', labelCtrl);

    //'dataServices'
    labelCtrl.$inject = ['settingHelper','modelReport'];

    function labelCtrl(settingHelper, modelReport) {
        var vm = this;
        console.log(vm);

        vm.focusContainer = focusContainer;
        function focusContainer(dataElement) {
            var data = dataElement ? dataElement : modelReport.models.container[0].elements;
            data.forEach(function (element) {
                switch (element.type){
                    case 'label':element.id !== vm.id ? focusInActive(element): focusActive(element); break;
                    case 'grid': gridParse(element); break;
                }
            });
        }

        function gridParse(grid){
            grid.gridStructure.rows.forEach(function (row) {
                row.cells.forEach(function (cell) {
                    focusContainer(cell.childrens);
                })
            })
        }
        function focusActive(element) {
            element.selected = true;
            settingHelper.element = element;
            settingHelper.container = element;
            //settingHelper.container = null;
        }
        function focusInActive(element) {
            element.selected = false;
        }
    }
})();