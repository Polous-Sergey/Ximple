(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditorCtrl', EditorCtrl);

    EditorCtrl.$inject = ['$scope', 'elementHelper', 'modelReport','$rootScope', '$state','user'];

    function EditorCtrl($scope, elementHelper, modelReport,$rootScope, $state, user ) {
        var vm = this;
        if(user.getUser() == undefined ){
            $state.go('login');
        }
        $scope.$watch(function () {
            return elementHelper.element
        }, function (table, oldTable) {
            console.log('him wacher started');
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
            vm.models = modelReport.models;
        }

        $rootScope.$on('loadStructure', function (event, data) {
            // active();
            vm.models = data.models;
            console.log('root scope')
        });
    }
})();