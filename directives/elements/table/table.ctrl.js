(function () {
    'use strict';

    angular
        .module('app')
        .controller('tableCtrl', tableCtrl);

    tableCtrl.$inject = ['settingHelper', 'url', 'request'];
    function tableCtrl(settingHelper, url, request) {
        var vm = this;
        vm.focusContainer = focusContainer;
        vm.changeLabel = changeLabel;
        vm.selectCell = selectCell;


        function focusContainer(cell, container) {
            settingHelper.element = cell;
            settingHelper.container = container;
        }
        var tempCell = null;
        function selectCell(cell) {
            tempCell = cell;
        }
        function changeLabel(item) {
            if (tempCell.displayName !== item.value) {

                var saveData = {
                    id: item.id,
                    properties: {
                        color: '#000000'
                    },
                    text:item.value 
                };
                request.request(url.createLabel, "PUT", saveData).then(function (data) {
                    console.log(data);
                });
                console.log(item);
            }
        }
    }
})(); 