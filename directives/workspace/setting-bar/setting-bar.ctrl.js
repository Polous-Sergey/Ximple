(function () {
    'use strict';

    angular
        .module('app')
        .controller('settingBarCtrl', settingBarCtrl);

    settingBarCtrl.$inject = ['reportList', 'request', 'url', 'modelReport'];
    function settingBarCtrl(reportList, request, url, modelReport) {
        var vm = this;
        vm.templates = [
            'directives/workspace/setting-bar/reportList/reportList.html',
            'directives/workspace/setting-bar/saveReportJson/saveReportJson.html'
        ];
        vm.template = vm.templates[0];
        vm.showReportList = showReportList;
        vm.selectedReporting = selectedReporting;
        vm.loadReport = loadReport;
        vm.saveReportJsonModal = saveReportJsonModal;
        vm.saveReportJson = saveReportJson;

        function showReportList() {
            vm.selectedItem = null;
            vm.reportingList = reportList.getReportList();
            vm.template = vm.templates[0];
            $('#settingBarModal').modal('show');
        }
        var headers = {
            'Content-Type': 'application/json'
        };

        function selectedReporting(index) {
            vm.selectedItem = index;
        }

        function loadReport() {
            request.request(url.loadReport, 'GET', null, { reportName: vm.reportingList[vm.selectedItem]}, headers).then(function (data) {
                console.log(data);
            })
        }


        function saveReportJsonModal() {
            vm.template = vm.templates[1];
            $('#settingBarModal').modal('show');
        }

        function saveReportJson() {
            var obj = {
                reportName: vm.reportingJsonName,
                report:modelReport.models
            }
            request.request(url.saveReportJson, 'POST', obj, null, headers).then(function (data) {
                reportList.addReportName(obj.reportName);
                $('#settingBarModal').modal('hide');
            })
        }
    }
})(); 