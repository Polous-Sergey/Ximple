(function () {
    'use strict';

    angular
        .module('startApp')
        .factory('refactorObj', refactorObj);

    refactorObj.$inject = ['settingHelper', 'request', 'url'];

    function refactorObj(settingHelper, request, url) {
        return {
            joinTablesCreateObj: joinTablesCreateObj
        };

        function joinTablesCreateObj(data, joinDataSetName) {
            var dataSetTable = {
                id: data.dataSetId,
                dataSetName: joinDataSetName,
                tableName: "",
                type:'table',
                columns: []
            };
            var columns = [];
            data.leftTableAliases.forEach(function (item) {
                var i = item.indexOf('::');
                var elem = {
                    columnName: item,
                    nativeName: item,
                    displayName: item.substring(i+2),
                    selected: true
                };
                columns.push(elem);
            });
            data.rightTableAliases.forEach(function (item) {
                var i = item.indexOf('::');
                var elem = {
                    columnName: item,
                    nativeName: item,
                    displayName: item.substring(i+2),
                    selected: true
                };
                columns.push(elem);
            });
            dataSetTable.columns = columns;
            console.log(dataSetTable);
            return dataSetTable;
        }
    }
})();