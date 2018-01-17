(function () {
    'use strict';

    angular
        .module('app')
        .factory('deleteFac', deleteFac);

    deleteFac.$inject = [];

    function deleteFac() {

        return {
            element: {}
        }
    }
})();