(function () {
    'use strict';

    angular
        .module('app')
        .controller('listElementsCtrl', listElementsCtrl);

    listElementsCtrl.$inject = ['$scope', 'elementsModel', 'request', 'url', 'settingHelper', 'addElements', 'storage'];

    //dataServices
    function listElementsCtrl($scope, elementsModel, request, url, settingHelper, addElements, storage) {
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
                filterList: ['between', 'in', 'bottom-percent', 'bottom-n', 'eq'],
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
                    console.log(vm.dataSetFilters);
                },
                addInValue: function () {
                    this.curentFilter.firstPropertyList.push(this.tempFirstFilter);
                    this.tempFirstFilter = '';
                    console.log(this.curentFilter);
                },
                addFilter: function () {
                    this.filters.push(angular.copy(this.curentFilter));
                }
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

            vm.table = {
                column: '',
                row: ''
            };
            vm.joinType = [
                'Inner join',
                'Join left',
                'Join right',
                'Full join'
            ]
            vm.tableColumns = [];
            vm.gridModel = {
                countColumn: 2,
                countRow: 2
            };
            vm.joinDataSet = [{
                firstTable: null,
                secondTable: null,
                firstColumns: [],
                secondColumns: [],
                type: null,
                name: "",
                selectColumns: [],
                showJoinCollums: false
            }];
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
                    console.log(data);
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
                vm.joinDataSet.firstTable = null;
                vm.joinDataSet.secondTable = null;
                vm.joinDataSet.selectFirstColumn = null;
                vm.joinDataSet.selectColumns = [];
                vm.showJoinCollums = false;
                vm.joinDataSet.type = null;
                vm.toJoinTablesList =[];

                request.request(url.getConfigJoin, 'GET').then(function (data) {
                    vm.fromJoinTablesList = data.data;
                    console.log('aaaaaaaaaaaaaaaaaaa', data.data)
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
                        type: null,
                        name: "",
                        selectColumns: [],
                        showJoinCollums: false
                    };

                    vm.joinDataSet.push(tmpJoinDataSet);
                }

            }

            function getColumnsJoinTable(tableName, table, mainKey) {
                vm.joinDataSet.selectColumns = [];

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
                        });
                        console.log(vm.columnsJoin,'qweqweqe');
                    } else {
                        vm.joinPopapMainData[mainKey].fieldsData = '';
                    }

                }

            }

            function changeJoinColumn(mainKey, index, checked) {
                console.log(mainKey, index,checked )
                if(checked){
                    vm.joinDataSet.selectColumns.push(vm.joinPopapMainData[mainKey].fieldsData[index]);
                    console.log(vm.joinDataSet.selectColumns)
                }else{
                    vm.joinDataSet.selectColumns.splice(index,1);
                    console.log(vm.joinDataSet.selectColumns)
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
                getColumnsTable(vm.joinDataSet.firstTable.tableName).then(function (data) {
                    vm.joinDataSet.firstColumns = data;
                }).then(function () {
                    getColumnsTable(vm.joinDataSet.secondTable.tableName).then(function (data) {
                        vm.joinDataSet.secondColumns = data;
                        vm.tableColumns.length = 0;
                        vm.tableColumns = vm.tableColumns.concat(vm.joinDataSet.firstColumns, vm.joinDataSet.secondColumns);
                        vm.template = vm.templates[4];
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
                vm.joinDataSet.filters = vm.dataSetFilters.filters;
                vm.joinDataSet.firstTable = vm.joinDataSet.firstTable.tableName;
                vm.joinDataSet.secondTable = vm.joinDataSet.secondTable.tableName;
                console.log(vm.joinDataSet);
                addElements.tableJoin(vm.joinDataSet);
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
                if (joinFlag) {
                    vm.joinDataSet.firstColumns.forEach(function (item) {
                        item.selected = true;
                    });
                    vm.joinDataSet.secondColumns.forEach(function (item) {
                        item.selected = true;
                    });
                    return;
                }
                vm.tableColumns.forEach(function (item, i) {
                    item.selected = true;
                });
            }

            function selectNoneRow(joinFlag) {
                if (joinFlag) {
                    vm.joinDataSet.firstColumns.forEach(function (item) {
                        item.selected = false;
                    });
                    vm.joinDataSet.secondColumns.forEach(function (item) {
                        item.selected = false;
                    });
                    return;
                }
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




        }
    }
})();