(function () {
    'use strict';

    angular
        .module('app')
        .controller('ReportShowCtrl', ReportShowCtrl);

    ReportShowCtrl.$inject = ['$scope', '$rootScope'];

    function ReportShowCtrl($scope, $rootScope) {
        var vm = this;
        $rootScope.loaderFlag = false;
    }
})();