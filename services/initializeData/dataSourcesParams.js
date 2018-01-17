(function() {
    'use strict';

    angular
        .module('app')
        .factory('dataSourcesParams', dataSourcesParams);

    dataSourcesParams.$inject = [];
    function dataSourcesParams() {
        return {
            name : 'report'
        };

    }
})();