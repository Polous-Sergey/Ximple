(function () {
    'use strict';

    angular
        .module('startApp')
        .factory('elementHelper', elementHelper);

    elementHelper.$inject = [];

    function elementHelper() {

        return {
            element: null,
            gridSelect: null
        }
    }
})();