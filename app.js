(function () {
    'use strict';
    angular.module('startApp', ['startApp.core',
        'startApp.services',
        'startApp.request'
    ]).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }]).run(['$state',function($state){
        $state.go('login');
    }]);
})();