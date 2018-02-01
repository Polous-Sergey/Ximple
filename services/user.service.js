;(function () {
    'use strict';

    angular
        .module('service.user', [])
        .service('user', user);

    user.$inject = ['http','$sessionStorage','$localStorage', 'url','$state'];

    function user(http, $sessionStorage, $localStorage, url,$state) {

         return {
            login : login,
            logout : logout,
            setUser : setUser,
            getUser : getUser
        };

        function login(data) {
            console.log('logging in');
            return http.post(url.login, data).then(function (res) {
                return res;
            });
        }

        function logout() {
            $localStorage.$reset();
            $state.go('login');
        }

        function setUser(data) {
            $localStorage.user = data;
        }

        function getUser() {
            return $localStorage.user;
        }
    }
})();
