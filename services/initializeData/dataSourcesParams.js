(function() {
    'use strict';

    angular
        .module('startApp')
        .factory('dataSourcesParams', dataSourcesParams);

    dataSourcesParams.$inject = [];
    function dataSourcesParams() {
        return {
            name : 'report'
        };

    }
})();