(function () {
    'use strict';

    angular
        .module('app')
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