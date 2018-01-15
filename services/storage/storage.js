(function() {
    'use strict';

    angular
        .module('startApp')
        .factory('storage', storage);

    storage.$inject = ['$q'];
    function storage($q) {
        var tables = [];
        return{
            getTables: getTables,
            setTables: setTables
        };

        function getTables() {
            return tables;
        }

        function setTables(newTable) {
            tables.length = 0;
            tables.push.apply(tables, newTable);
        }
    }
})();