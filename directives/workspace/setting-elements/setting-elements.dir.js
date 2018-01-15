(function () {
    'use strict';

    angular
        .module('startApp')
        .directive('settingElements', settingElements);

    settingElements.$inject = [];

    function settingElements() {
        var directive = {
            bindToController: true,
            controller: "SettingCtrl",
            templateUrl: "directives/workspace/setting-elements/setting-elements.html",
            controllerAs: 'vm',
            link: link,
            restrict: 'AE',
            scope: true
        };
        return directive;

        function link(scope, element, attrs) {


        }
    }
})();