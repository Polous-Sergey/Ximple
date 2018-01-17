(function () {
    'use strict';

    angular
        .module('factory.deleteFac', [])
        .factory('deleteFac', deleteFac);

    deleteFac.$inject = [];

    function deleteFac() {

        return {
            element: {}
        }
    }
})();