;(function () {
    angular
        .module('factory.url', [])
        .factory('url', url);

    url.$inject = [];

    function url() {

        // var proxy = "http://localhost:8080/";
        var server = 'http://localhost:8080/http://10.69.52.15/XimpleReportWeb/';
        // var server = 'http://localhost:8080/http://192.168.1.123:9080/XimpleReportWeb/';
        // var server = 'http://localhost:9083/XimpleReportWeb/';
        // var server = proxy + serv;

        return {
            login: server + 'userLogin',
            initializedDataSource: server + 'report/new',
            newDataSources: server + 'dataSource/newDefault',
            dataSet: server + 'metadata/tables',
            dataSetNew: server + 'report/odaDataSet',
            createTable: server + 'report/table',
            dataSetCreate: null,
            dataSetFilters: null,
            joinDataSet: server + 'report/joinDataSet',
            getConfigJoin: server + 'metadata/joinTables',
            tableMetadata: server + 'metadata/columns?schemaName=CAPWD_DTA&tableName=',
            saveReport: server + 'report/save',
            createLabel: server + 'report/label',
            createGrid: server + 'report/grid',
            loadReport: server + 'report/open',
            saveReportJson: server + 'report/save',
            odajoinDataSet: function (id) {
                return  server + 'report/joinSqlDataSet/fillBaseData'
            },
            setDataSetCreate: function (id) {
                if (!id) {
                    console.warn('no id', id);
                    return;
                }
                this.dataSetCreate = server + 'report/odaDataSet/' + id + '/fillBaseData';
                this.dataSetFilters = server + 'report/filters/' + id;
            },
            showReport: function (reportName, reportType) {
                var showURL =server + "reportShow";
                if(reportName !== "" || reportType !==""){
                    showURL+="?";

                    var isSet = false;
                    if(reportName !== ""){
                        showURL += "reportName=" + reportName;
                        isSet = true;
                    }
                    if(reportType !== ""){
                        if(isSet){
                            showURL += "&"
                        }
                        showURL += "reportFormat=" + reportType;
                    }
                }
                return showURL;
                /*server + 'reportShow?reportName=' + reportName + '.rptdesign&reportFormat=' + reportType*/;
            },
            deleteColumns: function (id) {
                return server + 'report/table/' + id + '/columns';
            },
            addColumns: function (id) {
                return server + 'report/table/'+ id + '/columns';
            }
        };
    }
})();