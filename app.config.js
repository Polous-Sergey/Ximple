angular.module('startApp')
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            // $urlRouterProvider.otherwise('/login');


            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'templates/login/login.html',
                    controller: 'LoginCtrl',
                    controllerAs: 'vm',
                    // resolve: {
                    //     initialData: function (initializeData) {
                    //         return initializeData.createNewReport();
                    //     }
                    // }
                })
                .state('edit', {
                    url: '/edit',
                    templateUrl: 'templates/editor/editor.html',
                    controller: 'EditorCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        initialData: function (initializeData) {
                            return initializeData.createNewReport();
                        }
                    }
                })
                .state('reportShow', {
                    url: '/reportShow',
                    templateUrl: 'templates/reportShow/reportShow.html',
                    controller: 'ReportShowCtrl',
                    controllerAs: 'vm'
                });
        }
    ]);

