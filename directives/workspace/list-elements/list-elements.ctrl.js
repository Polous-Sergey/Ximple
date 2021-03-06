(function () {
    'use strict';

    angular
        .module('app')
        .controller('listElementsCtrl', listElementsCtrl);

    listElementsCtrl.$inject = ['$scope', 'elementsModel', 'request', 'url', 'settingHelper', 'addElements', 'storage','toastr'];

    //dataServices
    function listElementsCtrl($scope, elementsModel, request, url, settingHelper, addElements, storage, toastr) {
        this.$onInit = function () {
            var vm = this;
            vm.selectTableName = "";
            vm.showJoinCollums = false;
            vm.templates = [
                'directives/workspace/list-elements/table/table.html',
                'directives/workspace/list-elements/tableFromDataBase/tableFromDataBase.html',
                'directives/workspace/list-elements/tableFromDataBase/tableFromDataBaseSetting.html',
                'directives/workspace/list-elements/tableJoin/tableJoinPopup.html',
                'directives/workspace/list-elements/tableJoin/tableJoinSettingPopup.html',
                'directives/workspace/list-elements/grid/grid.html'
            ];
            vm.dataSetFilters = {
                filterList: [],
                filters: [],
                flagTemplateValue: 0,
                tempFirstFilter: '',
                curentFilter: {
                    operation: '',
                    expression: '',
                    firstPropertyList: [],
                    secondPropertyList: []
                },
                changeOperator: function () {
                    switch (this.curentFilter.operation) {
                        case this.filterList[0]:
                            this.flagTemplateValue = 0;
                            console.log(1);
                            break;
                        case this.filterList[1]:
                            this.flagTemplateValue = 1;
                            this.curentFilter.secondPropertyList = [];
                            this.curentFilter.firstPropertyList = [];
                            break;
                        case this.filterList[2]:
                            this.flagTemplateValue = 0;
                            console.log(3);
                            break;
                        case this.filterList[3]:
                            this.flagTemplateValue = 0;
                            console.log(4);
                            break;
                    }
                },
                addInValue: function () {
                    if(this.tempFirstFilter == ''){

                    }else {
                        this.curentFilter.firstPropertyList.push(this.tempFirstFilter);
                        this.tempFirstFilter = '';
                    }

                    console.log(this.curentFilter);
                    console.log(vm.tableColumns)
                },
                addFilter: function () {
                    if(this.curentFilter.firstPropertyList.length === 0 ||
                        this.curentFilter.operation === null){
                        toastr.error('Please check your filter parameters');
                    }else{
                        this.filters.push(angular.copy(this.curentFilter));
                        vm.dataSetFilters.curentFilter.secondPropertyList=[];
                        vm.dataSetFilters.curentFilter.firstPropertyList=[];
                    }
                    console.log(this.curentFilter);

                    console.log(vm.tableColumns)
                }
            };

            vm.sortableOptionsFirstTable = {
                connectWith: ".first-table-container",
                'ui-floating': true
            };
            vm.sortableOptionsSecondTable = {
                connectWith: ".second-table-container",
                'ui-floating': true
            };

            vm.addLabel = addLabel;
            vm.openGridPopup = openGridPopup;
            vm.addGrid = addGrid;
            vm.openCustomTablePopup = openCustomTablePopup;
            vm.openTableFromDataBasePopup = openTableFromDataBasePopup;
            vm.settingTableDataFromDataBase = settingTableDataFromDataBase;
            vm.createTableFromDataBase = createTableFromDataBase;
            vm.openJoinTablePopup = openJoinTablePopup;
            vm.openJoinTablesSettingPopup = openJoinTablesSettingPopup;
            vm.finishJoinTable = finishJoinTable;
            vm.getColumnsJoinTable = getColumnsJoinTable;
            vm.changeJoinColumn = changeJoinColumn;
            vm.selectColumnFirstTable = selectColumnFirstTable;
            vm.selectColumnSecondTable = selectColumnSecondTable;
            vm.upRowPosition = upRowPosition;
            vm.downRowPosition = downRowPosition;
            vm.selectAllRow = selectAllRow;
            vm.selectNoneRow = selectNoneRow;

            vm.backPopup = backPopup;

            vm.localSave = localSave;

            vm.table = {
                column: '',
                row: ''
            };
            vm.joinType = [
                'INNER JOIN',
                'RIGHT JOIN',
                'LEFT JOIN'
            ];
            vm.tableColumns = [];
            vm.gridModel = {
                countColumn: 2,
                countRow: 2
            };
            vm.joinDataSet = [];
            // vm.joinDataSet = [{
            //     firstTable: null,
            //     secondTable: null,
            //     firstColumns: [],
            //     secondColumns: [],
            //     type: null,
            //     name: "",
            //     selectColumns: [],
            //     showJoinCollums: false
            // }];
            vm.fromJoinTablesList = [];
            vm.toJoinTablesList = [];
            vm.columnsJoin = [];

            function addLabel() {
                addElements.label();
            }

            function openGridPopup() {
                vm.template = vm.templates[5];
                $('#tablesModal').modal('show');
            }

            function addGrid() {
                $('#tablesModal').modal('hide');
                addElements.grid(vm.gridModel);
            }

            function openCustomTablePopup() {
                vm.template = vm.templates[0];
                $('#tablesModal').modal('show');
            }

            function openTableFromDataBasePopup() {
                vm.template = vm.templates[1];
                $('#tablesModal').modal('show');
            }

            function settingTableDataFromDataBase() {
                request.request(url.tableMetadata + vm.selectTableName, 'GET').then(function (data) {
                    vm.tableColumns = data.data;
                    vm.tableColumns.forEach(function (item, i, arr) {
                        item.selected = true;
                        item.displayName = item.columnName;
                    });
                    vm.template = vm.templates[2];
                });
            }

            function createTableFromDataBase() {
                addElements.tableFromDataBase(vm.selectTableName, vm.tableColumns, vm.dataSetFilters.filters);
            }

            function openJoinTablePopup() {
                vm.toJoinTablesList = [];
                vm.joinDataSet = [];
                vm.dataSetFilters.filters = [];
                vm.dataSetFilters.curentFilter.firstPropertyList = [];
                vm.dataSetFilters.curentFilter.secondPropertyList = [];
                vm.dataSetFilters.filters = [];
                // vm.joinDataSet = [{
                //     firstTable: null,
                //     secondTable: null,
                //     firstColumns: [],
                //     secondColumns: [],
                //     type: null,
                //     name: "",
                //     selectColumns: [],
                //     showJoinCollums: false
                // }];

                request.request(url.getConfigJoin, 'GET').then(function (data) {
                    vm.fromJoinTablesList = data.data;
                    addNewJoin();
                });
                vm.template = vm.templates[3];
                $('#tablesModal').modal('show');


                /////////////////////////
                ///////////////////////////////

                vm.joinPopapMainData = [];

                vm.addNewJoin = addNewJoin;


                function addNewJoin() {
                    var tmpObj = {
                        firstTable: vm.fromJoinTablesList,
                        secondTable: vm.fromJoinTablesList,
                        joinType: vm.joinType,
                        fieldsData: []
                    };

                    vm.joinPopapMainData.push(tmpObj);

                    var tmpJoinDataSet = {
                        firstTable: null,
                        secondTable: null,
                        firstColumns: [],
                        secondColumns: [],
                        type: 'INNER JOIN',
                        name: "",
                        selectColumns: [],
                        showJoinCollums: false
                    };

                    vm.joinDataSet.push(tmpJoinDataSet);
                }

            }

            function getColumnsJoinTable(tableName, table, mainKey) {
                vm.joinDataSet[mainKey].selectColumns = [];

                switch (table) {
                    case 'first':
                        vm.joinDataSet[mainKey].secondTable = null;
                        vm.joinDataSet[mainKey].showJoinCollums = false;
                        vm.joinPopapMainData[mainKey].secondTable = tableName.joinTables;
                        break;
                    case 'second':
                        createDisplayName(tableName);
                        vm.joinDataSet[mainKey].showJoinCollums = true;
                        break;
                }

                function createDisplayName(data) {
                    if (data !== null) {
                        vm.joinPopapMainData[mainKey].fieldsData = data.joinColumns;
                        vm.joinPopapMainData[mainKey].fieldsData.map(function (item) {
                            item.checked = false;
                            item.type = 'AND';
                        });
                    } else {
                        vm.joinPopapMainData[mainKey].fieldsData = '';
                    }

                }

            }

            function changeJoinColumn(mainKey, index, checked) {
                if(checked){
                    vm.joinDataSet[mainKey].selectColumns.push(vm.joinPopapMainData[mainKey].fieldsData[index]);
                }else{
                    vm.joinDataSet[mainKey].selectColumns.forEach(function (el) {
                    if(!el.checked){
                        vm.joinDataSet[mainKey].selectColumns.splice(vm.joinDataSet[mainKey].selectColumns.indexOf(el), 1)
                    }});
                }
                // vm.joinDataSet.selectFirstColumn = vm.columnsJoin[index].joinColumn;
                // vm.joinDataSet.selectSecondColumn = vm.columnsJoin[index].inverseJoinColumn;
            }

            function openJoinTablesSettingPopup() {
                // if (vm.joinDataSet.firstTable == null ||
                //     vm.joinDataSet.secondTable == null ||
                //     vm.joinDataSet.selectFirstColumn == null ||
                //     vm.joinDataSet.selectSecondColumn == null) {
                //     return;
                // }

                // vm.dataSetFilters.filters = [];

                vm.tableColumns.length = 0;
                vm.joinDataSet.forEach(function (el, index) {



                    getColumnsTable(el.firstTable.tableName).then(function (data) {
                        el.firstColumns = data;
                    }).then(function () {
                        getColumnsTable(el.secondTable.tableName).then(function (data) {
                            el.secondColumns = data;
                            var newArr = vm.tableColumns.concat(el.firstColumns, el.secondColumns);
                            vm.tableColumns = vm.tableColumns.concat(newArr);
                            vm.template = vm.templates[4];
                        });
                    });

                });
            }

            function getColumnsTable(tableName) {
                if (tableName !== null) {
                    return request.request(url.tableMetadata + tableName, 'GET').then(function (data) {
                        return createDisplayName(data.data);
                        // switch (table){
                        //     case 'first': vm.joinDataSet.firstColumns = createDisplayName(data.data);break;
                        //     case 'second': vm.joinDataSet.secondColumns = createDisplayName(data.data);break;
                        // }
                    });
                }

                function createDisplayName(data) {
                    data.forEach(function (item) {
                        item.displayName = item.columnName;
                        item.selected = true;
                    });
                    return data;
                }
            }

            function finishJoinTable() {
                addElements.tableJoin(vm.joinDataSet, vm.dataSetFilters.filters);
                $('#DataSetTablesModal').modal('hide');
            }

            function selectColumnFirstTable(index) {
                //todo wtf is this shit
                // vm.joinDataSet.selectFirstColumn = index;
            }

            function selectColumnSecondTable(index) {
                //todo wtf is this shit
                // vm.joinDataSet.selectSecondColumn = index;
            }

            function backPopup(id) {
                vm.template = vm.templates[id];
            }

            function selectAllRow(joinFlag) {
                // if (joinFlag) {
                //     vm.joinDataSet.firstColumns.forEach(function (item) {
                //         item.selected = true;
                //     });
                //     vm.joinDataSet.secondColumns.forEach(function (item) {
                //         item.selected = true;
                //     });
                //     return;
                // }
                vm.tableColumns.forEach(function (item, i) {
                    item.selected = true;
                });
            }

            function selectNoneRow(joinFlag) {
                // if (joinFlag) {
                //     vm.joinDataSet.firstColumns.forEach(function (item) {
                //         item.selected = false;
                //     });
                //     vm.joinDataSet.secondColumns.forEach(function (item) {
                //         item.selected = false;
                //     });
                //     return;
                // }
                vm.tableColumns.forEach(function (item, i) {
                    item.selected = false;
                });
            }

            function upRowPosition(index) {
                var tempElement = vm.tableColumns[index - 1];
                vm.tableColumns[index - 1] = vm.tableColumns[index];
                vm.tableColumns[index] = tempElement;
            }

            function downRowPosition(index) {
                var tempElement = vm.tableColumns[index + 1];
                vm.tableColumns[index + 1] = vm.tableColumns[index];
                vm.tableColumns[index] = tempElement;
            }

            active();

            function active() {
                vm.tablesList = storage.getTables();
                //vm.dataset = dataServices.dataSet;
            }

            vm.setFiltersArr = setFiltersArr;
            vm.filtersTab = filtersTab;


            function filtersTab() {
                vm.curentFilter = vm.tableColumns[0];
                setFiltersArr ()
            }

            function setFiltersArr () {
                vm.dataSetFilters.curentFilter.operation = null;
                vm.dataSetFilters.tempFirstFilter = null;
                if (vm.curentFilter.columnType === 'CHAR' ){
                    vm.dataSetFilters.filterList = ['in', 'eq'];
                    vm.charOnly = false;
                }else {
                    vm.dataSetFilters.filterList = ['between', 'in', 'bottom-percent', 'bottom-n', 'eq'];
                    vm.charOnly = true;
                }
                vm.dataSetFilters.curentFilter.expression = vm.curentFilter.columnName
            }

            function localSave() {
                console.log('local save is work')
            }


        }

    }
})();