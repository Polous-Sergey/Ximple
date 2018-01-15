(function () {
    'use strict';

    angular
        .module('startApp')
        .controller('ContainerCtrl', ContainerCtrl);

    ContainerCtrl.$inject = ['settingHelper'];

    function ContainerCtrl(settingHelper) {
        var vm = this;
        vm.focusContainer = focusContainer;
        function focusContainer() {
            settingHelper.element = null;
            vm.model.forEach(function(element,i,c){
                if(vm.number === i){
                    element.selected = true;
                    settingHelper.style = element.style;
                    settingHelper.element = null;
                }
                else{
                    element.selected = false;
                }
            });
        }
    }
})();