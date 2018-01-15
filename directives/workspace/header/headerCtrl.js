(function () {
    'use strict';

    angular
        .module('startApp')
        .controller('headerCtrl', headerCtrl);

    headerCtrl.$inject = ['request', 'url', '$window', 'saveQueue'];
//'dataServices',
    function headerCtrl(request, url, $window, saveQueue) {
        this.$onInit = function () {
            var vm = this;
            vm.fileName = '';
            vm.selectedTableName = '';
            vm.selectedTable = {};
            vm.templates = [
                'directives/workspace/header/templatesHtml/saveReport.html',
                'directives/workspace/header/templatesHtml/showReport.html'
            ];
            vm.saveReportFinish = saveReportFinish;
            vm.saveReport = saveReport;
            vm.showReports = showReports;
            vm.showSaveReportPopup = showSaveReportPopup;



            // vm.dataSetFilters = {
            //     filterList: ['between', 'in', 'bottom-percent', 'bottom-n'],
            //     filters: [],
            //     flagTemplateValue: 0,
            //     tempFirstFilter: '',
            //     curentFilter: {
            //         operation: '',
            //         expression: '',
            //         firstPropertyList: [],
            //         secondPropertyList: []
            //     },
            //     changeOperator: function () {
            //         switch (this.curentFilter.operation) {
            //             case this.filterList[0]:
            //                 this.flagTemplateValue = 0;
            //                 console.log(1);
            //                 break;
            //             case this.filterList[1]:
            //                 this.flagTemplateValue = 1;
            //                 this.curentFilter.secondPropertyList = [];
            //                 this.curentFilter.firstPropertyList = [];
            //                 break;
            //             case this.filterList[2]:
            //                 this.flagTemplateValue = 0;
            //                 console.log(3);
            //                 break;
            //             case this.filterList[3]:
            //                 this.flagTemplateValue = 0;
            //                 console.log(4);
            //                 break;
            //         }
            //         console.log(vm.dataSetFilters);
            //     },
            //     addInValue: function () {
            //         this.curentFilter.firstPropertyList.push(this.tempFirstFilter);
            //         this.tempFirstFilter = '';
            //         console.log(this.curentFilter);
            //     },
            //     addFilter: function () {
            //         this.filters.push(angular.copy(this.curentFilter));
            //     }
            // };


            vm.reportFormatType = ['html', 'xlsx', 'xls', 'pdf'];
            vm.saveReportObj = {
                'reportName': "",
                'reportFormat': ''
            };

            function saveReport() {
                vm.template = vm.templates[0];
                $('#DataSetTablesModal').modal('show');
            }

            function saveReportFinish() {
                saveQueue.saveLastElement();
                request.request(url.saveReport, 'POST', null, {fileName: vm.fileName}).then(function (data) {
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
        }
    }
})();