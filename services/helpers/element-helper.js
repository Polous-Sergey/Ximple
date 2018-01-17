(function () {
    'use strict';

    angular
        .module('app')
        .factory('elementHelper', elementHelper);

    elementHelper.$inject = [];

    function elementHelper() {

        return {
            element: null,
            gridSelect: null
        }
    }
})();