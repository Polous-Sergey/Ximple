(function () {
    'use strict';

    angular
        .module('startApp')
        .controller('EditorCtrl', EditorCtrl);

    EditorCtrl.$inject = ['$scope', 'elementHelper', 'modelReport','$rootScope', '$state'];

    function EditorCtrl($scope, elementHelper, modelReport,$rootScope, $state ) {
        var vm = this;
        if($rootScope.isLogined == undefined ||$rootScope.isLogined == false  ){
            $state.go('login');
        }
        $scope.$watch(function () {
            return elementHelper.element
        }, function (table, oldTable) {
            if (table !== null) {
                for (var i = 0; i < vm.models.container.length; i++) {
                    if (vm.models.container[i].selected) {
                        vm.models.container[i].elements.push(table);
                        elementHelper.element = null;
                        break;
                    }
                }
            }
        }, true);

        // $scope.$watch(function () {
        //     return deleteFac.element
        // }, function (el, oldTable) {
        //     if (el === null) {
        //         return;
        //     }
        //     console.log(el);
        //     for (var i = 0; i < vm.models.container.length; i++) {
        //         if (vm.models.container[i].selected) {
        //             for (var j = 0; j < vm.models.container[i].elements.length; j++) {
        //                 if (vm.models.container[i].elements[j].selected) {
        //                     console.log(vm.models.container[i].elements.splice(j, 1));
        //                     console.log(j);
        //                     deleteFac.element = null;
        //                     return;
        //                 }
        //             }
        //         }
        //     }
        // }, true);

        active();
        function active()  {
            //vm.dataServices = dataServices;
            vm.models = modelReport.models;

        }
    }
})();