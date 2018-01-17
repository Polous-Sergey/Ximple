;(function () {
    'use strict';

    angular
        .module('factory.elementHelper', [])
        .factory('elementHelper', elementHelper);

    elementHelper.$inject = [];

    function elementHelper() {

        return {
            element: null,
            gridSelect: null
        }
    }
})();