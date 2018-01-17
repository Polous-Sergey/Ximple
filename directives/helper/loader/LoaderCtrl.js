(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoaderCtrl', LoaderCtrl);

    LoaderCtrl.$inject = ['$interval'];

    function LoaderCtrl($interval) {
        var vm = this;
        vm.loading = "";
        vm.loaderCnt = 0;
        vm.maxLoaderCnt = 3;
        $interval(function () {
            if (vm.loaderCnt < vm.maxLoaderCnt) {
                vm.loading += '.';
                vm.loaderCnt++;
            }
            else {
                vm.loading = '';
                vm.loaderCnt = 0;
            }
        }, 800);
    }
})();