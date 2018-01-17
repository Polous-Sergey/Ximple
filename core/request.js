;(function () {
    'use strict';
    angular
        .module('factory.request', [])
        .factory('http', http);

    http.$inject = ['$http', '$q', '$localStorage' , 'toastr'];

    function http($http, $q, $localStorage , toastr) {
        console.log('create request service');

        return {
            get: function (url, data) {
                return request('GET', url, data);
            },
            post: function (url, data) {
                return request('POST', url, data);
            },
            put: function (url, data) {
                return request('PUT', url, data);
            },
            delete: function (url, data) {
                return request('DELETE', url, data);
            }
        };

        function request(method, url, data) {

            var token = $localStorage.token;


            var config = {
                dataType: 'json',
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };
            if(typeof token != 'undefined') {
                config.headers.token = token;
            }

            if (method === 'GET') {
                config.params = data;
                config.timeout = 20000;
            }
            else {
                config.data = data;
            }

            config.url = url;

            // console.log(config, 'data for sand');

            return $http(config)
                .then(requestComplete)
                .catch(requestFailed);
        }

        function requestFailed(err) {
            var defer = $q.defer();
            console.info('error', err);

            if (err.data == null || !err.data.error) {
                if (err.status === 200) {
                    toastr.error('Server error: ' + err.data);
                }
                else if (err.status === -1) {
                    toastr.error('Server is not available');
                }
                else if (err.status === 0) {
                    toastr.error('There is no Internet connection');
                }
                else if (err.status === 500) {
                    toastr.error('Server error: ' + err.status + ' ' + err.data.message);
                }
                else if (response.status === 403) {
                    toastr.error('Forbidden');
                }
                else {
                    toastr.error('Server error: ' + err.status + ' ' + err.statusText);
                }
            }
            else {
                toastr.error(err.data.error);

            }
            defer.reject(response.data);
            return defer.promise;
        }

        function requestComplete(response) {
            var defer = $q.defer();
            console.info('response', url, response);
            if (response.data.error) {
                toastr.error(response.data.error);
                defer.reject(response.data.error);
            }
            defer.resolve(response.data);
            return defer.promise;
        }
    }
})();