(function () {
    'use strict';
    angular.module('startApp', [
        "ui.router",
        "colorpicker.module",
        "angular-loading-bar",
        "ngAnimate",
        "toastr"
    ]).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }]).run(['$state',function($state){
        $state.go('login');
    }]);
})();