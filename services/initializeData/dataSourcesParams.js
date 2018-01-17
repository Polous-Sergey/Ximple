(function() {
    'use strict';

    angular
        .module('factory.dataSourcesParams', [])
        .factory('dataSourcesParams', dataSourcesParams);

    dataSourcesParams.$inject = [];
    function dataSourcesParams() {
        return {
            name : 'report'
        };

    }
})();