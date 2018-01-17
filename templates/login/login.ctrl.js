(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['request', 'url', 'toastr', '$rootScope', '$state', 'reportList', 'user'];

    function LoginCtrl(request, url, toastr, $rootScope, $state, reportList, user) {
        var vm = this;
        vm.login = login;
        console.log(user);
        vm.loginData = {
            id: "00013",
            name: "",
            password: ""
        };

        function login() {
            debugger;
            if (!checkLoginData()) {
                return;
            }

            debugger;

            var headers = {
                'Content-Type': 'application/json'
            };
            var data = {
                userName: vm.loginData.name,
                userPassword: vm.loginData.password,
                companyId: "00013"
            };
            user.login(data).then(function (res) {
                console.log(res,'123')
            });
            request.request(url.login, "POST", {}, data, headers)
                .then(function (data) {
                    if (data.status === 200) {
                        reportList.setReportList(data.data.reports);
                        $rootScope.isLogined = true;
                        $state.go('edit');
                        return true;
                    }
                }, function (dataErr) {
                    $rootScope.isLogined = false;
                    toastr.error('Authorization failed', 'Error', {
                        timeOut: 5000
                    })
                });
        }

        function checkLoginData() {
            if (vm.loginData.name === "" ||
                vm.loginData.password === "") {
                toastr.error("Please input all data", 'Login error', {timeOut: 4000});
                return false;
            }
            return true;
        }

    }
})();