(function() {
    'use strict';

    angular
        .module('startApp')
        .directive('listElements', listElements);

        listElements.$inject = [];
    function listElements() {
        var directive = {
            bindToController: true,
            templateUrl: "directives/workspace/list-elements/list-elements.html",
            controller: "listElementsCtrl",
            controllerAs: 'vm',
            link: link,
            replace: true,
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