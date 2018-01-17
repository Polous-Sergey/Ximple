;(function () {
    'use strict';
    angular
        .module('app')
        .config(mainConfig);

    /* @ngInject */
    function mainConfig($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/auth/login/login.html',
                controller: 'Login',
                controllerAs: 'vm'
            })
            .state('forgot-password', {
                url: '/forgot-password',
                templateUrl: 'templates/auth/forgot-password/forgot-password.html',
                controller: 'ForgotPassword',
                controllerAs: 'vm'
            })
            .state('reset-password', {
                url: '/reset-password',
                templateUrl: 'templates/auth/reset-password/reset-password.html',
                controller: 'ResetPassword',
                controllerAs: 'vm'
            })
            .state('verified', {
                url: '/verified',
                templateUrl: 'templates/auth/verified/verified.html'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'templates/auth/signup/signup.html',
                controller: 'Signup',
                controllerAs: 'vm'
            })
            .state('app', {
                    templateUrl: 'templates/app/app.html',
                    abstract: true,
                    resolve: {
                        /* @ngInject */
                        getUser: function (user) {
                            return user.userAutoLogin();
                        }
                    }
                }
            )
            .state('admin-create-account', {
                url: '/create_account',
                templateUrl: 'templates/admin/admin-create-account/admin-create-account.html',
                controller: 'AdminCreateAccount',
                controllerAs: 'vm'
            })
            .state('app.dashboard', {
                url: '',
                templateUrl: 'templates/dashboard/dashboard.html',
                abstract: true,
                controller: 'Dashboard',
                controllerAs: 'vm'
            })
            .state('app.dashboard.admin-dashboard', {
                url: '/dashboard',
                templateUrl: 'templates/dashboard/admin-dashboard/admin-dashboard.html',
                controller: 'AdminDashboard',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    getClientAll: function (client, $rootScope, clientData, user) {
                        if (user.role().isSA() && !clientData.getCurrentClient().id) {
                            return client.all()
                                .then(function (response) {
                                    if (response.clients.length) {
                                        return client.info(
                                            {
                                                client_id: response.clients[0].id
                                            }).then(
                                            function (res) {
                                                clientData.setClients(response.clients);
                                                clientData.setCurrentClient(response.clients[0]);
                                                clientData.setCurrentClientData(res);
                                                return response;
                                            }
                                        );
                                    } else {
                                        return response;
                                    }
                                });
                        }
                    },
                    /* @ngInject */
                    getImprovementAll: function (getClientAll, improvement, clientData) {
                        if (clientData.clientAvailable()) {
                            var client_id = clientData.getCurrentClient().id;
                            return improvement.all({
                                client_id: client_id,
                                sort: '-created_at'
                            }).then(function (res) {
                                clientData.setClientImprovements(res.improvements);
                                return res;
                            });
                        }
                    },
                    /* @ngInject */
                    getReports: function (getClientAll, underway, clientData) {
                        if (clientData.clientAvailable()) {
                            return underway.all({
                                client_id: clientData.getCurrentClient().id
                            }).then(function (res) {
                                clientData.setClientReports(res);
                                return res;
                            });
                        }
                    }
                }
            })


            .state('app.dashboard.qi-dashboard', {
                url: '/client-dashboard',
                templateUrl: 'templates/dashboard/qi-dashboard/qi-dashboard.html',
                controller: 'QiDashboard',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    getClientOne: function (client, user, clientData) {
                        if (user.getUser().client_id) {
                            return client.info(
                                {
                                    client_id: user.getUser().client_id
                                }).then(function (response) {
                                //creating manual client data
                                clientData.setCurrentClient({
                                    active: true,
                                    clientAdmin: response.clientAdmin,
                                    id: user.getUser().client_id,
                                    name: user.getUser().client_name,
                                    promo: response.promo
                                });
                                clientData.setCurrentClientData(response);
                                return response;
                            });
                        }
                    },
                    /* @ngInject */
                    getImprovementAll: function (improvement, getClientOne, clientData) {
                        if (clientData.clientAvailable()) {
                            return improvement.all(
                                {
                                    client_id: clientData.getCurrentClient().id,
                                    sort: '-created_at'
                                }).then(function (res) {
                                clientData.setClientImprovements(res.improvements);
                                return res;
                            });
                        }
                    },
                    /* @ngInject */
                    getReports: function (underway, getClientOne, clientData) {
                        if (clientData.clientAvailable()) {
                            return underway.all(
                                {
                                    client_id: clientData.getCurrentClient().id
                                })
                                .then(function (res) {
                                    clientData.setClientReports(res);
                                    return res;
                                });
                        }
                    }
                }
            })

            .state('app.notifications', {
                url: '/notification',
                templateUrl: 'templates/notifications/notifications.html',
                controller: 'Notifications',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    getClientData: function (clientData) {
                        return clientData.updateCurrentClientData();
                    },
                    /* @ngInject */
                    getAllObserver: function (observe) {
                        return observe.all()
                            .then(function (response) {
                                return response;
                            });
                    },
                }
            })

            .state('app.notice', {
                url: '/notice',
                templateUrl: 'templates/notice/notice.html',
                controller: 'NoticeCtrl',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    allNotice: function (notice, clientData) {
                        if (clientData.clientAvailable()) {
                            return notice.all({
                                client_id: clientData.getCurrentClient().id
                            }).then(function (res) {
                                return res;
                            });
                        }
                    }
                }
            })

            .state('app.good-day', {
                url: '/good-day-measure',
                templateUrl: 'templates/good-day/good-day.html',
                controller: 'GoodDay',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    getItems: function (user) {
                        if (user.role().isTM()) {
                            return user.availableItems()
                                .then(function (res) {
                                    return res;
                                });
                        }
                    },
                }
            })

            .state('app.privacy-policy', {
                url: '/privacy-police',
                templateUrl: 'templates/privacy-policy/privacy-policy.html',
                controller: 'PrivacyPolicy',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    privacyText: function (privacy) {
                        return privacy.view().then(function (res) {
                            return res.privacy_police;
                        });
                    }
                }
            })

            .state('app.user-management', {
                url: '/user-management',
                templateUrl: 'templates/user-management/user-management.html',
                controller: 'UserManagement',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    getUserAll: function (user) {
                        return user.all()
                            .then(function (response) {
                                return response.users;
                            });
                    }
                }
            })
            .state('app.improvement-log', {
                url: '/improvement-log',
                templateUrl: 'templates/improvement-log/improvement-log.html',
                controller: 'ImprovementLog',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    getItems: function (user) {
                        if (user.role().isTM() || user.role().isObs()) {
                            return user.availableItems()
                                .then(function (res) {
                                    return res;
                                });
                        }
                    },

                    /* @ngInject */
                    getImprovementAll: function (improvement, $stateParams, clientData, user, utils) {
                        var local = "en-us";
                        var now = new Date();
                        var year = now.getFullYear();
                        var month = now.toLocaleString(local, {month: "long"});
                        var client_id = clientData.getCurrentClient().id || user.getUser().client_id;
                        var team_ids = [];
                        if (user.role().isTM() && user.getUser().manager_in_teams.length) {
                            team_ids = user.getUser().manager_in_teams;
                        } else if (user.role().isObs()) {
                            team_ids = user.getUser().observer_in_teams;
                        }
                        var config = {
                            month: month,
                            year: year,
                        };
                        if (team_ids.length) {
                            config.team_id = utils.getArrByParam(team_ids, 'id');
                        }
                        config.client_id = client_id;
                        return improvement.all(config)
                            .then(function (res) {
                                return res;
                            });
                    },
                    /* @ngInject */
                    getClientOne: function (client, $rootScope, user) {
                        if (user.role().isQA()) {
                            return client.info(
                                {
                                    client_id: user.getUser().client_id
                                }).then(function (response) {
                                return response;
                            });
                        }
                    }
                }
            })

            .state('app.contact', {
                url: '/contact',
                templateUrl: 'templates/contact/contact.html',
                controller: 'Contact',
                controllerAs: 'vm'
            })

            .state('app.manager', {
                url: '/manager',
                templateUrl: 'templates/manager/manager.html',
                controller: 'ManagerController',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    managersList: function (user) {
                        return user.myTeamManagersList().then(function (res) {
                            return res.team_managers;
                        });
                    }
                }
            })

            .state('app.improvements-items', {
                url: '/improvements-items?team_id',
                templateUrl: 'templates/mobile/improvements-items/improvements-items.html',
                controller: 'UnderwayItemsController',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    underway: function (underway, user, $stateParams) {
                        return underway.all({
                            client_id: user.getUser().client_id,
                            team_ids: $stateParams.team_id ? [+$stateParams.team_id] : []
                        }).then(function (res) {
                            return res.underway;
                        });
                    }
                }
            })
            .state('app.teams', {
                    url: '/teams',
                    templateUrl: 'templates/teams/teams.html',
                    controller: 'Teams',
                    controllerAs: 'vm',
                    resolve: {
                        /* @ngInject */
                        getClientData: function (clientData, user) {
                            if (user.role().isQA() || user.role().isSA()) {
                                return clientData.updateCurrentClientData();
                            }
                        },
                        /* @ngInject */
                        getTeamsAll: function (teams, user) {
                            if (user.role().isQA() || user.role().isSA()) {
                                return teams.all()
                                    .then(function (response) {
                                        return response;
                                    });
                            }
                        },
                        /* @ngInject */
                        getAllClientUser: function (user) {
                            if (user.role().isTM()) {
                                return user.all()
                                    .then(function (response) {
                                        return response.users || [];
                                    });
                            }
                        },
                    },
                }
            )

            .state('app.observer', {
                    url: '/observer',
                    templateUrl: 'templates/observe/observe.html',
                    controller: 'Observe',
                    controllerAs: 'vm',
                    resolve: {
                        /* @ngInject */
                        getClientData: function (clientData) {
                            return clientData.updateCurrentClientData();
                        },
                        /* @ngInject */
                        getAllTeams: function (teams) {
                            return teams.all()
                                .then(function (response) {
                                    return response;
                                });
                        },
                        /* @ngInject */
                        getAllObserver: function (observe) {
                            return observe.all()
                                .then(function (response) {
                                    return response;
                                });
                        }
                    }
                }
            )

            .state('app.clients-management', {
                    url: '/clients-management',
                    templateUrl: 'templates/clients-management/clients-management.html',
                    controller: 'ClientsManagement',
                    controllerAs: 'vm',
                    resolve: {
                        /* @ngInject */
                        getTypeAll: function (type) {
                            return type.all()
                                .then(function (response) {
                                    return response;
                                });
                        }
                    }
                }
            )

            .state('app.survey-management', {
                    url: '/survey-management',
                    templateUrl: 'templates/survey-management/survey-management.html',
                    controller: 'SurveyManagement',
                    controllerAs: 'vm',
                    resolve: {
                        /* @ngInject */
                        getClientData: function (clientData) {
                            return clientData.updateCurrentClientData();
                        },
                        /* @ngInject */
                        getQuestAll: function (questionnaires, clientData) {
                            if (clientData.getCurrentClient().id) {
                                return questionnaires.getClientAllSurvey(
                                    {
                                        id: clientData.getCurrentClient().id
                                    }
                                ).then(function (response) {
                                    return response;
                                });
                            }
                        },
                        /* @ngInject */
                        getQuestTypeAll: function (questionnaires) {
                            return questionnaires.allInputType()
                                .then(function (response) {
                                    return response;
                                });
                        },
                        /* @ngInject */
                        getTeamsAll: function (teams) {
                            return teams.all()
                                .then(function (response) {
                                    return response;
                                });
                        }
                    }
                }
            )

            .state('app.tm-dashboard', {
                url: '/tm-dashboard',
                templateUrl: 'templates/dashboard/tm-dashboard/tm-dashboard.html',
                controller: 'TmDashboard',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    getItems: function (user) {
                        return user.availableItems()
                            .then(function (res) {
                                return res;
                            });
                    }
                }
            })
            .state('app.observer-dashboard', {
                url: '/observer-dashboard',
                templateUrl: 'templates/dashboard/observer-dashboard/observer-dashboard.html',
                controller: 'ObserverDashboard',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    getItems: function (user) {
                        return user.availableItems()
                            .then(function (res) {
                                return res;
                            });
                    }
                }
            })
            .state('app.mobile-app', {
                url: '/app',
                templateUrl: 'templates/mobile/mobile-app.html',
                controller: 'MobileApp',
                controllerAs: 'vm',
                resolve: {}
            })
            .state('app.mobile-app-share', {
                url: '/app/share',
                templateUrl: 'templates/mobile/share/share.html',
                controller: 'MobileAppShare',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    getItems: function (user) {
                        return user.availableItems();
                    }
                }
            })
            .state('app.mobile-app-idea', {
                url: '/app/idea',
                templateUrl: 'templates/mobile/idea/idea.html',
                controller: 'MobileAppIdea',
                controllerAs: 'vm',
                params: {
                    site_id: null,
                    client_theme_id: null,
                    team_id: null,
                    team_theme_id: null
                }
            })
            .state('app.mobile-app-thanks', {
                url: '/app/thanks',
                templateUrl: 'templates/mobile/thanks/thanks.html',
                controller: 'MobileAppThanks',
                controllerAs: 'vm'
            })
            .state('app.mobile-app-improvements', {
                url: '/app/improvements',
                templateUrl: 'templates/mobile/improvements/improvements.html',
                controller: 'MobileAppImprovements',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    teams: function (user) {
                        return user.availableItems().teams;
                    }
                }
            })
            .state('app.mobile-app-edit', {
                url: '/app/edit',
                templateUrl: 'templates/mobile/edit/edit.html',
                controller: 'MobileAppEdit',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    userInfo: function (user) {
                        return user.getUserInfo();
                    }
                }
            })

            .state('app.mobile-app-survey', {
                url: '/app/survey',
                templateUrl: 'templates/mobile/survey/survey.html',
                controller: 'MobileAppSurvey',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    allUserSurvey: function (questionnaires) {
                        return questionnaires.getUserSurvey()
                            .then(function (result) {
                                return result;
                            });
                    }
                }
            })
            .state('app.my-ideas', {
                    url: '/app/my-ideas',
                    templateUrl: 'templates/mobile/my-ideas/my-ideas.html',
                    controller: 'MyIdeasController',
                    controllerAs: 'vm',
                    resolve: {
                        /* @ngInject */
                        all: function (user) {
                            if (user.role().isUser() || user.role().isTM() || user.role().isQA() ) {
                                return user.personalImprovement({
                                    'users_id[]': user.getUser().id
                                }).then(function (res) {
                                    var temp = [];
                                    angular.forEach(res, function (value, key) {
                                        temp = temp.concat(value);
                                    });
                                    return temp;
                                });
                            }
                        }
                    }
                }
            )
            .state('app.idea-details', {
                url: '/idea-details?id',
                templateUrl: 'templates/mobile/idea-details/idea-details.html',
                controller: 'IdeasDetailsController',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    improve: function (improvement, $stateParams) {
                        var credentials = {
                            id: $stateParams.id
                        };
                        return improvement.one(credentials).then(function (res) {
                            if (res.success) {
                                return res.improvement;
                            }
                        });
                    }
                }
            })
            .state('app.my-mood', {
                url: '/app/my-mood',
                templateUrl: 'templates/mobile/my-mood/my-mood.html',
                controller: 'MyMoodController',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    moods: function (moodService, moodDateService) {
                        var currentMonth = moodDateService.currentMonth;
                        var currentMoodMonth = {
                            month: currentMonth
                        };
                        return moodService.getMyMoodByDate(currentMoodMonth)
                            .then(function (res) {
                                return res;
                            });
                    }
                }
            })
            .state('app.message', {
                url: '/app/messages',
                templateUrl: 'templates/mobile/messages/messages.html',
                controller: 'MessagesController',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    all: function (user) {
                        if (user.role().isUser() || user.role().isTM() || user.role().isQA() ) {
                            return user.personalImprovement({
                                'users_id[]': user.getUser().id
                            }).then(function (res) {
                                var temp = [];
                                angular.forEach(res, function (value, key) {
                                    temp = temp.concat(value);
                                });
                                return temp;
                            });
                        }
                    }
                }
            })
            .state('app.message-dialog', {
                url: '/message-dialog?id',
                templateUrl: 'templates/mobile/dialog/dialog.html',
                controller: 'DialogController',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    improveInfo: function (user, $stateParams, improvement) {
                        return improvement.one({
                            id: $stateParams.id
                        }).then(function (res) {
                            return res;
                        });
                    }
                }

            })
            .state('app.mobile-app-teams', {
                url: '/app/teams',
                templateUrl: 'templates/mobile/teams/teams.html',
                controller: 'MobileAppTeams',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    getItems: function (user) {
                        return user.availableItems()
                            .then(function (res) {
                                return res;
                            });
                    }
                }
            })
            .state('app.mobile-app-notice', {
                url: '/app/notice',
                templateUrl: 'templates/mobile/notice/notice.html',
                controller: 'MobileAppNotice',
                controllerAs: 'vm',
                resolve: {
                    /* @ngInject */
                    allNotice: function (notice, user) {
                        if (!user.getUser()) {
                            return [];
                        }
                        return notice.all({
                            client_id: user.getUser().id
                        }).then(function (res) {
                            return res;
                        });
                    }
                }
            });

    }
})();

