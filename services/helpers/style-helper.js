(function () {
    'use strict';

    angular
        .module('factory.settingHelper', [])
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