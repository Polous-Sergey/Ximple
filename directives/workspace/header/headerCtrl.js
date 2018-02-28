(function () {
    'use strict';

    angular
        .module('app')
        .controller('headerCtrl', headerCtrl);

    headerCtrl.$inject = ['request', 'url', '$window', 'saveQueue','user'];
//'dataServices',
    function headerCtrl(request, url, $window, saveQueue, user) {
        this.$onInit = function () {
            var vm = this;
            vm.user = user.getUser();
            console.log('user', vm.user);
            vm.fileName = '';
            vm.selectedTableName = '';
            vm.selectedTable = {};
            vm.templates = [
                'directives/workspace/header/templatesHtml/saveReport.html',
                'directives/workspace/header/templatesHtml/showReport.html',
                'directives/workspace/header/templatesHtml/openReport.html'
            ];
            vm.saveReportFinish = saveReportFinish;
            vm.saveReport = saveReport;
            vm.openReport = openReport;
            vm.openReportFinish = openReportFinish;
            vm.showReports = showReports;
            vm.showSaveReportPopup = showSaveReportPopup;
            vm.logout = logout;

            vm.reportFormatType = ['html', 'xlsx', 'xls', 'pdf'];
            vm.saveReportObj = {
                'reportName': "",
                'reportFormat': ''
            };

            function saveReport() {
                vm.template = vm.templates[0];
                $('#DataSetTablesModal').modal('show');
            }

            function openReport() {
                vm.template = vm.templates[2];
                $('#DataSetTablesModal').modal('show');
            }

            function openReportFinish() {
                request.request(url.openReport(vm.fileName), 'POST').then(function (data) {
                    vm.fileName = '';
                    $('#DataSetTablesModal').modal('hide');
                });
            }

            function saveReportFinish() {
                saveQueue.saveLastElement();
                // var dataForSend = {
                //     reportName: vm.fileName
                //     // report:
                // };
                request.request(url.saveReport(vm.fileName), 'POST').then(function (data) {
                    vm.fileName = '';
                    $('#DataSetTablesModal').modal('hide');
                });
            }

            function showSaveReportPopup() {
                vm.template = vm.templates[1];
                $('#DataSetTablesModal').modal('show');
            }

            function showReports() {
                console.log(vm.saveReportObj);
                $window.open(url.showReport(vm.saveReportObj.reportName, vm.saveReportObj.reportFormat), '_blank');
            }

            function logout() {
                user.logout()
            }
        }
    }
})();