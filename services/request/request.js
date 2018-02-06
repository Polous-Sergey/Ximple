(function () {
    'use strict';

    angular
        .module('factory.request', [])
        .factory('request', request);

    request.$inject = ['$http', '$q', 'url', '$httpParamSerializerJQLike','$state'];

    function request($http, $q, url, $httpParamSerializerJQLike,$state) {
        return {
            request:request
        };
        function request(urlPath, method, data, params,headers) {
            var defer = $q.defer();
            $http({
                method: method,
                url: urlPath,
                data: data,
                params: params,
                withCredentials: true,
                headers:headers
            }).then(function (dataResult) {
                console.log('result', dataResult);
                defer.resolve(dataResult);
            }, function (dataError) {
                console.log('err',dataError);
                if(dataError.status == 401){
                    $state.go('login');
                }
                defer.reject(dataError);
            });
            return defer.promise;
        }
    }
})();