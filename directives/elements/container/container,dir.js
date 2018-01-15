(function () {
    'use strict';

    angular
        .module('startApp')
        .directive('container', container);

    container.$inject = [];

    function container() {

        var directive = {
            bindToController: true,
            controller: 'ContainerCtrl',
            controllerAs: 'vm',
            templateUrl: "directives/elements/container/container.html",
            replace: true,
            link: link,
            restrict: 'AE',
            scope: {
                element: '=',
                model: '=',
                number: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();