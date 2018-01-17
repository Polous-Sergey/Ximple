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
        vm.data = {
            userName: "",
            userPassword: ""
        };

        function login() {
            console.log(vm.data)
            if (!checkLoginData()) {
                return;
            }
            console.log(vm.data)
            user.login(vm.data).then(function (res) {
                console.log(res)
                if(res.success){
                    reportList.setReportList(res.reports);
                    $rootScope.isLogined = true;
                    $state.go('edit');
                }else{
                    $rootScope.isLogined = false;
                    toastr.error('Authorization failed', 'Error', {
                        timeOut: 5000
                    })
                }
            });

        }

        function checkLoginData() {
            if (vm.data.userName === "" ||
                vm.data.companyId === "" ||
                vm.data.userPassword === "") {
                toastr.error("Please input all data", 'Login error', {timeOut: 4000});
                return false;
            }
            return true;
        }

    }
})();