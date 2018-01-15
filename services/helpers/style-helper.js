(function () {
    'use strict';

    angular
        .module('startApp')
        .factory('settingHelper', settingHelper);

    settingHelper.$inject = [];

    function settingHelper() {


        return {
            element: null,
            columnStyle:null,
            rowStyle:null,
            container: null
        }
    }
})();