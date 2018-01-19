(function() {
    'use strict';

    angular
        .module('factory.initializeData', [])
        .factory('initializeData', initializeData);

    initializeData.$inject = ['$rootScope', 'request', 'url', 'dataSourcesParams', 'storage'];
    function initializeData($rootScope, request, url, dataSourcesParams,  storage) {
        return {
           createNewReport:createNewReport
        };

        function createNewReport() {
            $rootScope.loaderFlag = true;
            request.request(url.initializedDataSource, "POST").then(function (data) {
                if (data.status === 200) {
                    createDataSources();
                    return true;
                }
            }, function (dataErr) {
                console.log(dataErr);
                $rootScope.loaderFlag = false;
            });
        }
        function createDataSources() {
            return request.request(url.newDataSources, "POST", null, {dataSourceName: dataSourcesParams.name}).then(function (data) {
                loadTables();
                // $rootScope.loaderFlag = false;
            }, function (dataErr) {
                console.log(dataErr);
                $rootScope.loaderFlag = false;
            });
        }
        function loadTables(){
            request.request(url.dataSet, "GET").then(function (data) {
                debugger
                if(typeof(data.data)=== 'object'){
                    storage.setTables(data.data);
                    $rootScope.loaderFlag = false;
                }else{
                    storage.setTables([]);
                    $rootScope.loaderFlag = false;
                }

                //return true;
            }, function (data) {
                console.log(data);
                $rootScope.loaderFlag = false;
            });
        }

    }
})();