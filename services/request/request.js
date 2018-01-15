(function () {
    'use strict';

    angular
        .module('startApp')
        .factory('request', request);

    request.$inject = ['$http', '$q', 'url', '$httpParamSerializerJQLike'];

    function request($http, $q, url, $httpParamSerializerJQLike) {
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
                defer.resolve(dataResult);
            }, function (dataError) {
                defer.reject(dataError);
            });
            return defer.promise;
        }
    }
})();