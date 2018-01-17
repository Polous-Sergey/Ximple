(function() {
    'use strict';

    angular
        .module('app')
        .directive('headerDirective', headerDirective);

    headerDirective.$inject = [];
    function headerDirective() {
        var directive = {
            bindToController: true,
            controller: "headerCtrl",
            controllerAs: 'vm',
            templateUrl:"directives/workspace/header/header.html",
            link: link,
            restrict: 'AE',
            scope: {
                tables: '='
            }
        };
        return directive;
        
        function link(scope, element, attrs) {
        }
    }
})();