(function () {
    'use strict';

    angular
        .module('app')
        .controller('gridCtrl', gridCtrl);

    gridCtrl.$inject = ['settingHelper'];

    function gridCtrl(settingHelper) {
        var vm = this;
        vm.focusContainer = focusContainer;


        console.log(this);

        function focusContainer(cell, column, row, grid) {
            settingHelper.container = grid;
            settingHelper.element = cell;
            settingHelper.columnStyle = column;
            settingHelper.rowStyle = row;
        }
    }
})();