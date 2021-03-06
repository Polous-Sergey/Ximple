(function () {
    'use strict';

    angular
        .module('app')
        .controller('SettingCtrl', SettingCtrl);

    SettingCtrl.$inject = ['$scope', '$rootScope', 'settingHelper', 'deleteFac', 'request', 'url', 'saveQueue'];

    function SettingCtrl($scope, $rootScope, settingHelper, deleteFac, request, url, saveQueue) {
        var vm = this;
        vm.elements = {
            textAlign: [
                'left', 'center', 'right'
            ],
            borderWidth: ['0px', '1px', '2px', '3px', '4px', '5px'],
            borderStyle: ['solid', 'dotted', 'dashed', 'double']
        };
        vm.deleteElement = deleteElement;
        vm.switchBorder = switchBorder;

        $scope.$watch(function () {
            return settingHelper
        }, function (newVal, oldVal) {
            console.log('Setting halper wacher');
            console.log('Setting halper wacher', newVal, oldVal);
            if (newVal.element !== null) {
                vm.style = newVal.element.style;
            }
            if (newVal.columnStyle !== null) {
                vm.columnStyle = newVal.columnStyle.style;
            }
            if (newVal.rowStyle !== null) {
                vm.rowStyle = newVal.rowStyle.style;
            }

            if (newVal.element === null) return;
            console.log('save started');

            switch (settingHelper.container.type) {
                case 'label':
                    vm.typeElement = 1;
                    break;
                case 'grid':
                    vm.typeElement = 2;
                    break;
                case 'table':
                    vm.typeElement = 3;
                    break;
            }

            console.log('vm.typeElement', vm.typeElement);

            saveQueue.saveElement(newVal, oldVal);

        }, true);


        // $scope.$watch(function () {
        //     return settingHelper.element
        // }, function (newVal, oldVal) {
        //     console.log('setting helper element wacher');
        //     // if(newVal.element.style !== oldVal.element.style && oldVal.element !== null){
        //     //     console.warn('save data');
        //     //     console.log(newVal.element);
        //     //     console.log(oldVal.element);
        //     // }
        //     // console.log(newVal);
        //     // console.log(oldVal);
        // });


        function deleteElement() {
            deleteFac.element = settingHelper;
            console.log(deleteFac.element);
        }

        function switchBorder(side) {
            console.log(side);
            switch (side) {
                case 'top':
                    vm.style['borderTopWidth'] = "0px";
                    break;
                case 'right':
                    vm.style['borderRightWidth'] = "0px";
                    break;
                case 'bottom':
                    vm.style['borderBottomWidth'] = "0px";
                    break;
                case 'left':
                    vm.style['borderLeftWidth'] = "0px";
                    break;
            }
        }
    }
})();