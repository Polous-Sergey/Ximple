;(function () {
    'use strict'; 

    angular
        .module('factory.reportList', [])
        .factory('reportList', reportList);

        reportList.$inject = []; 
    function reportList() {
        var reportList = [];

        return {
            addReportName: addReportName,
            setReportList: setReportList,
            getReportList: getReportList
        };

        function addReportName(item) {
            this.reportList.push(item);
        }
        function setReportList(value) {
            this.reportList = value;
        }
        function getReportList() {
            return this.reportList;
        }
    }
})(); 