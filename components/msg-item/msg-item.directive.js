;(function () {
    'use strict';
    angular.module('directive.msgItem', [])
        .directive('msgItem', menuBar);

    function menuBar() {
        return {
            strict: 'AE',
            scope: {
                data: '='
            },
            templateUrl: 'components/msg-item/msg-item.html',
            link: function (scope, element, attrs, model) {
            },
            controller: 'MsgItem',
            controllerAs: 'vm'
        };

    }
})();
