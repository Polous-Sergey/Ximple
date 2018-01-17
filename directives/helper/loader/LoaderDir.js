(function() {
    'use strict';

    angular
        .module('app')
        .directive('loader', loader);

    loader.$inject = ['$rootScope'];
    function loader($rootScope) {
        var directive = {
            controller: "LoaderCtrl",
            templateUrl:"directives/helper/loader/Loader.html",
            link: link,
            scope: false,
            restrict: 'E'
        };
        return directive;
        
        function link(scope, element, attrs) {
            var el = angular.element(element[0].querySelector('#loader'));
            scope.$watch(function () {
                return $rootScope.loaderFlag
            } , function (newFlag) {
                if(newFlag){
                    el.css('opacity', '1');
                    el.css('height', '100vh');
                    el.css('z-index', '9999');
                }
                else{
                    el.css('opacity', '0');
                    el.css('height', '0px');
                    el.css('z-index', '0');
                }
            },true);
        }
    }
})();