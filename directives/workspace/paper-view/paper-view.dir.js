(function() {
    'use strict';

    angular
        .module('startApp')
        .directive('paperDesign', paperDesign);

    paperDesign.$inject = [];
    function paperDesign() {
        var directive = {
            bindToController: true,
            templateUrl:"directives/workspace/paper-view/paper-view.html",
            controller: "paperCtrl",
            controllerAs: 'vm',
            replace: true,
            link: link,
            restrict: 'AE',
            scope: {
                model: '='
            }
        };
        return directive;
        
        function link(scope, element, attrs) {

        }
    }
})();