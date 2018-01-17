(function () {
    'use strict';
    angular.module('startApp', ['startApp.core',
        'startApp.services',
    ]).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }]).run(['$state',function($state){
        $state.go('login');
    }]);
})();