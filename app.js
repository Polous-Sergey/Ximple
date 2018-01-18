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
        .run(['$state','user',function($state, user){
            if(user.getUser() !== undefined){
                $state.go('edit');
            }else{
                $state.go('login');
            }

    }]);
})();