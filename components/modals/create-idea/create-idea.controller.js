;(function () {
    angular
        .module('app')
        .controller('CreateIdeaController', CreateIdeaController);

    /* @ngInject */
    function CreateIdeaController($mdDialog, messagesNotice, toastr, clientData, improvement) {

        var vm = this;
        vm.createIdea = createIdea;
        vm.makeThemesArr = makeThemesArr;
        vm.close = function () {
            $mdDialog.cancel();
        };

        vm.data = {
            site_id: undefined,
            theme_id: undefined,
            subject: '',
            message: '',
            selected_team: undefined
        };
        vm.items = {
            teams: clientData.getCurrentClientData().teams,
            sites: clientData.getCurrentClientData().sites,
            themes: clientData.getCurrentClientData().themes
        };
        vm.themes = clientData.getCurrentClientData().themes;

        function makeThemesArr() {
            vm.themes = [];
            createTypeField(clientData.getCurrentClientData().themes, 'clientTheme');
            createTypeField(vm.data.selected_team.team_themes, 'teamTheme');
            vm.themes = vm.items.themes.concat(vm.data.selected_team.team_themes);
        }

        function createTypeField(arr, typeName) {
            arr.map(function (el) {
                el.type = typeName;

            });
        }

        function createIdea() {
            if (!vm.data.selected_team) {
                toastr.error(messagesNotice.error.selectTeam);
                return;
            }
            if (!vm.data.theme_id) {
                toastr.error(messagesNotice.error.selectTheme);
                return;
            }
            if (!vm.data.site_id) {
                toastr.error(messagesNotice.error.selectSite);
                return;
            }

            if (vm.data.subject.trim().length == 0 || vm.data.message.trim().length == 0) {
                toastr.error(messagesNotice.error.completeField);
                return;
            }

            var sendData = {
                site_id: vm.data.site_id.id,
                team_id: vm.data.selected_team.id,
                message: vm.data.message,
                subject: vm.data.subject,
                team_theme_id: undefined,
                client_theme_id: undefined
            };

            if (vm.data.theme_id.type === 'teamTheme') {
                sendData.team_theme_id = vm.data.theme_id.id;
            } else {
                sendData.client_theme_id = vm.data.theme_id.id;
            }

            improvement.create(sendData).then(function (response) {
                toastr.success(messagesNotice.success.created);
                $mdDialog.hide();
            });
        }
    }
})();
