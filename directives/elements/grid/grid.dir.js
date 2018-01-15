(function () {
    'use strict';

    angular
        .module('startApp')
        .directive('gridElement', gridElement);

    gridElement.$inject = ['request', 'url'];

    function gridElement(request, url) {
        var directive = {
            bindToController: true,
            templateUrl: 'directives/elements/grid/grid.html',
            controller: 'gridCtrl',
            controllerAs: 'vm',
            link: link,
            restrict: 'AE',
            scope: {
                element: '=',
                model: '=',
                number: '='
            }
        };
        return directive;

        function link(scope, elem, attrs) {
            var scrollable = elem.find('button.btn-delete-element');
            elem.bind('mouseover', function () {
                scrollable.css('display', 'block');
            });
            elem.bind('mouseleave', function () {
                scrollable.css('display', 'none');
            });

            scrollable.bind('click', function () {
                var el = scope.vm.element;
                request.request(url.createGrid + '/' + el.id, 'DELETE').then(function (data) {
                    scope.vm.model.forEach(function (item, i) {
                        if (item.id === el.id) {
                            scope.vm.model.splice(i, 1);
                        }
                    })
                });
            })
        }
    }
})();