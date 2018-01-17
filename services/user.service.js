;(function () {
    'use strict';

    angular
        .module('model.user', [])
        .service('user', user);

    user.$inject = ['http','$sessionStorage','$localStorage','url'];

    function user($sessionStorage, $localStorage, http, url) {

        var service = {
            login : login,
            setUser : setUser,
            getUser : getUser
        };

        function get(data) {
            return http.get(url, data).then(function (res) {
                return res;
            });
        }

        function login(data) {
            console.log('logging in')
            return http.post(url.login, data).then(function (res) {
                return res;
            });
        }

        function setUser(data) {
            $localStorage.user = data;
        }

        function getUser() {
            return $localStorage.user;
        }


        function userAutoLogin() {
            if ($localStorage.auth_key && $localStorage.auth_key.length && !getUser()) {
                $sessionStorage.auth_key = $localStorage.auth_key;
                return getUserInfo().then(function (data) {
                    return getSettings()
                        .then(function (res) {
                            setUser(data);
                            setUserSettings(res);
                        });
                });
            } else if (getUser() && !getUserSettings()) {
                $sessionStorage.auth_key = $localStorage.auth_key;
                return getSettings()
                    .then(function (res) {
                        setUserSettings(res);
                    });
            }
        }


        function role() {
            return {
                isTM: function isTM() {
                    var role = $rootScope.user && $rootScope.user.role;
                    if (role === 1 && $rootScope.user && $rootScope.user.manager_in_teams.length &&
                        $rootScope.user.observer_in_teams && !$rootScope.user.observer_in_teams.length) {
                        return true;
                    } else if (role === 7 && $rootScope.user.observer_in_teams && !$rootScope.user.observer_in_teams.length) {
                        return true;
                    }
                    return false;
                },

                isTMext: function isTMext() {
                    return !!($rootScope.user && $rootScope.user.role === 7);
                },

                isObs: function isObs() {
                    return !!($rootScope.user && $rootScope.user.observer_in_teams && $rootScope.user.observer_in_teams.length);
                },

                isUser: function isUser() {
                    return !!($rootScope.user && ($rootScope.user.role === 1 &&
                        !$rootScope.user.manager_in_teams.length &&
                        !$rootScope.user.observer_in_teams.length));
                },

                isQA: function isQA() {
                    return !!($rootScope.user && $rootScope.user.role === 5);
                },

                isSA: function isSA() {
                    return !!($rootScope.user && $rootScope.user.role === 10);
                }
            };
        }

        return service;

    }
})();
