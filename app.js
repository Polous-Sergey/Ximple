(function () {
    angular.module('app',
        [   'app.core',
            'app.directives',
            'app.request',
            'app.services',
            'app.filters'
        ])

        .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
        }])
        .run(['$state',function($state){
        $state.go('login');
    }]);
})();