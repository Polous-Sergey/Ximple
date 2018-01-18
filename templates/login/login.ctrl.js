(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['request', 'url', 'toastr', '$rootScope', '$state', 'reportList', 'user'];

    function LoginCtrl(request, url, toastr, $rootScope, $state, reportList, user) {
        var vm = this;
        vm.login = login;

        vm.data = {
            userName: "",
            userPassword: ""
        };

        function login(){
            if(!checkLoginData()) {
                return;
            }
            var headers = {
                'Content-Type': 'application/json'
            };


            request.request(url.login, "POST",{},vm.data,headers)
                .then(function (data) {
                    if (data.status === 200) {
                        reportList.setReportList(data.data.reports);
                        user.setUser(data.data)
                        $rootScope.isLogined = true;
                        $state.go('edit');
                        return true;
                    }
                }, function (dataErr) {
                    $rootScope.isLogined = false;
                    toastr.error('Authorization failed','Error',{
                        timeOut:5000
                    })
                });
        }

        function checkLoginData(){
            if(vm.data.userName === "" ||
                vm.data.userPassword === ""){
                toastr.error("Please input all data",'Login error', {timeOut:4000});
                return false;
            }
            return true;
        }

    }
})();