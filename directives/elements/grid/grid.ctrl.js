(function () {
    'use strict';

    angular
        .module('startApp')
        .controller('gridCtrl', gridCtrl);

    gridCtrl.$inject = ['settingHelper'];

    function gridCtrl(settingHelper) {
        var vm = this;
        vm.focusContainer = focusContainer;


        console.log(this);

        function focusContainer(cell, column, row, grid) {
            // console.log(cell, column, row);
            settingHelper.container = grid;
            settingHelper.element = cell;
            settingHelper.columnStyle = column;
            settingHelper.rowStyle = row;
        }
    }
})();