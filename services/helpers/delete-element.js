(function () {
    'use strict';

    angular
        .module('startApp')
        .factory('deleteFac', deleteFac);

    deleteFac.$inject = [];

    function deleteFac() {

        return {
            element: {}
        }
    }
})();