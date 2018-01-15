(function () {
    'use strict';

    angular
        .module('startApp')
        .factory('dataSet', dataSet);

    dataSet.$inject = ['dataSourcesParams', 'request', 'url'];

    function dataSet(dataSourcesParams, request, url) {

        return {
            createDataSet: createDataSet
        };

        function createDataSet() {
            var paramsSet = {
                dataSetName: 'ds' + (++dataSetCnt),
                dataSourceName: dataSourcesParams.name
            };
            return request.request(url.dataSetNew, "POST", null, paramsSet).then(function (data) {
                console.log(data);
                url.setDataSetCreate(data.data);
                return paramsSet.dataSetName;
            }, function (data) {
                console.log(data);
            });
        }
    }
})();