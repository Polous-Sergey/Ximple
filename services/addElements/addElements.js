;(function () {
    'use strict';

    angular
        .module('factory.addElements', [])
        .factory('addElements', addElements);

    addElements.$inject = ['settingHelper', 'request', 'url', 'elementsModel', 'modelReport', 'dataSourcesParams', 'refactorObj'];

    function addElements(settingHelper, request, url, elementsModel, modelReport, dataSourcesParams, refactorObj) {
        var dataSetCnt = 0;
        return {
            label: label,
            grid: grid,
            tableFromDataBase: tableFromDataBase,
            tableJoin: tableJoin
        };

        function label() {
            var labelObj = null;
            if (settingHelper.element !== null && settingHelper.container.name === 'grid') {
                labelObj = {parentId: settingHelper.element.id};
            }
            request.request(url.createLabel, 'POST', null, labelObj).then(function (data) {
                var label = elementsModel.labelModel(data.data);
                if (labelObj !== null) {
                    settingHelper.element.childrens.push(label);
                    return;
                }
                for (var i = 0; i < modelReport.models.container.length; i++) {
                    if (modelReport.models.container[i].selected) {
                        modelReport.models.container[i].elements.push(label);
                        break;
                    }
                }
            });
        }

        function grid(model) {
            request.request(url.createGrid, 'POST', null, model).then(function (data) {
                var grid = elementsModel.gridModel(data.data);
                for (var i = 0; i < modelReport.models.container.length; i++) {
                    if (modelReport.models.container[i].selected) {
                        modelReport.models.container[i].elements.push(grid);
                        break;
                    }
                }
            })
        }

        function tableFromDataBase(tableName, tableColumns, tableFilters) {
            var datasetName;
            var dataSetId;
            newDataSet().then(function (data) {
                datasetName = data.dataSetName;
                dataSetId = data.dataSetId;
                return dataSetCreate(tableName, tableColumns, tableFilters)
            }).then(function (data) {
                return createTable(datasetName, tableName, tableColumns);
            }).then(function (data) {
                var table = elementsModel.tableModelDataSet(data.data, dataSetId, tableColumns);

                if (tableFilters.length !== 0) {
                    setFilters(tableFilters).then(function (data) {
                        table.filters = data;
                        showTable(table);
                    });
                }
                else {
                    showTable(table);
                }

                function showTable(table) {
                    if (data.structure.parentId !== null && data.structure.parentId !== undefined) {
                        settingHelper.element.childrens.push(table);
                    }
                    else {
                        for (var i = 0; i < modelReport.models.container.length; i++) {
                            if (modelReport.models.container[i].selected) {
                                modelReport.models.container[i].elements.push(table);
                                break;
                            }
                        }
                    }
                    $('#tablesModal').modal('hide');
                }
            });
        }

        function foreacerFunc(data) {
            var result = [];
            data.forEach(function (item, index) {
                var obj = {};
                obj.name = item.columnName;
                obj.dataType = item.columnType;
                obj.analysis = "dimension";
                obj.nativeName = item.columnName;
                obj.displayName = item.displayName;
                obj.position = String(index + 1);
                obj.nativeColumnType = String(item.nativeColumnType);

                result.push(obj);
            });
            return result
        }
        function foreacerFunc2(data) {
            var result = [];
            data.forEach(function (item, index) {
                result.push(item.columnName);
            });
            return result
        }

        function tableJoin(joinData) {
            debugger;
            console.log('joinData', joinData);
            var firstDatasetName = [];
            var secondDatasetName = [];
            var firstDataSetId = [];
            var secondDataSetId = [];
            var joinDataSetName = 'jds' + (++dataSetCnt);
            var joinDataSetId;
            var arrColumns = [];

            var couter = 0;

            joinData.forEach(function (item, index) {
                newDataSet().then(function (data) {
                    firstDatasetName[index] = data.dataSetName;
                    firstDataSetId[index] = data.dataSetId;
                    return null;
                }).then(function (data) {
                    return dataSetCreate(joinData[index].firstTable.tableName, joinData[index].firstColumns);
                }).then(function () {
                    return newDataSet().then(function (data) {
                        secondDatasetName[index] = data.dataSetName;
                        secondDataSetId[index] = data.dataSetId;
                        return null;
                    })
                }).then(function (data) {
                    return dataSetCreate(joinData[index].secondTable.tableName, joinData[index].secondColumns).then(function () {couter++; next()});
                })
            });

            function next() {
                if(couter != joinData.length){
                  return
                }
                var joinObj = {};
                newDataSet().then(function (data) {
                    debugger;
                    joinObj = {
                        id: data.dataSetId,
                        rowFetchLimit: 50,
                        lictTables: [],
                        joinCondition: []
                    };
                    joinData.forEach(function (item, index) {
                        var firstSelectedColumns = item.firstColumns.filter(function (item) {
                            if(item.selected){
                                return true
                            }
                        });
                        firstSelectedColumns = foreacerFunc2(firstSelectedColumns);
                        var secondSelectedColumns = item.secondColumns.filter(function (item) {
                            if(item.selected){
                                return true
                            }
                        });
                        secondSelectedColumns = foreacerFunc2(secondSelectedColumns);
                        var tmpObj1 = [
                            {
                                name: item.firstTable.tableName,
                                columns: []
                            },{
                                name: item.secondTable.tableName,
                                columns: item.secondColumns
                            }
                        ];

                        tmpObj1[0].columns = foreacerFunc(item.firstColumns);
                        // item.firstColumns.forEach(function (item, index) {
                        //     var obj = {};
                        //     obj.name = item.columnName;
                        //     obj.dataType = item.columnType;
                        //     obj.analysis = "dimension";
                        //     obj.nativeName = item.columnName;
                        //     obj.displayName = item.displayName;
                        //     obj.position = String(index + 1);
                        //     obj.nativeColumnType = String(item.nativeColumnType);
                        //
                        //     tmpObj1[0].columns.push(obj);
                        // });
                        tmpObj1[1].columns = foreacerFunc(item.secondColumns);
                        // item.secondColumns.forEach(function (item, index) {
                        //     var obj = {};
                        //     obj.name = item.columnName;
                        //     obj.dataType = item.columnType;
                        //     obj.analysis = "dimension";
                        //     obj.nativeName = item.columnName;
                        //     obj.displayName = item.displayName;
                        //     obj.position = String(index + 1);
                        //     obj.nativeColumnType = String(item.nativeColumnType);
                        //
                        //     tmpObj1[1].columns.push(obj);
                        // });
                        var tmpObj2 = {
                            firstTable: index,
                            secondTable: index + 1,
                            type: joinData[index].type,
                            firstColumns: firstSelectedColumns,
                            secondColumns: secondSelectedColumns,
                            causes: ['AND'],
                            operators: [' = ']
                        };
                        joinObj.lictTables.push(tmpObj1[0]);
                        joinObj.lictTables.push(tmpObj1[1]);
                        joinObj.joinCondition.push(tmpObj2);
                    })

                }).then(function () {
                    return request.request(url.odajoinDataSet(joinObj.id), 'POST', joinObj).then(function (data) {
                        return refactorObj.joinTablesCreateObj(data.data, joinDataSetName);
                    })
                }).then(function (data) {

                    arrColumns = joinData.firstColumns.concat(joinData.secondColumns);
                    var tempColumns = [];
                    data.columns.forEach(function (item, i) {
                        item.displayName = arrColumns[i].displayName;
                        item.selected = arrColumns[i].selected;
                        if(item.selected){
                            tempColumns.push(item);
                        }
                    });

                    return createTable(data.dataSetName, "", tempColumns);
                }).then(function (data) {
                    joinDataSetId = data.data.id;
                    showTable(data);
                    function showTable(data) {
                        var table = elementsModel.tableModelDataSet(data.data, data.data.id, arrColumns);
                        if (data.structure.parentId !== null && data.structure.parentId !== undefined) {
                            settingHelper.element.childrens.push(table);
                        }
                        else {
                            for (var i = 0; i < modelReport.models.container.length; i++) {
                                if (modelReport.models.container[i].selected) {
                                    modelReport.models.container[i].elements.push(table);
                                    break;
                                }
                            }
                        }
                    }

                    $('#tablesModal').modal('hide');
                })
            }

        }

        function newDataSet() {
            var paramsSet = {
                dataSetName: 'ds' + (++dataSetCnt),
                dataSourceName: dataSourcesParams.name
            };
            return request.request(url.dataSetNew, "POST", null, paramsSet)
                .then(function (data) {
                    url.setDataSetCreate(data.data);
                    return {
                        dataSetName: paramsSet.dataSetName,
                        dataSetId: data.data
                    };
                }, function (data) {
                    console.log(data);
                });
        }

        function dataSetCreate(tableName, tableColumns) {
            var columnData = {
                schema: "CAPWD_DTA",
                tableName: tableName,
                columns: []
            };

            var cnt = 1;
            tableColumns.forEach(function (item) {
                var obj = {};
                obj.name = item.columnName;
                obj.dataType = item.columnType;
                obj.analysis = "dimension";
                obj.nativeName = item.columnName;
                obj.displayName = item.displayName;
                obj.position = cnt++;
                obj.nativeColumnType = item.nativeColumnType;

                columnData.columns.push(obj);
            });
            return request.request(url.dataSetCreate, "POST", columnData).then(function (data) {
                return data;
            }, function (data) {
                console.log(data);
            });
        }

        function createTable(dsName, tableName, tableColumns) {
            var res = {
                col: 1,
                detail: 1,
                footer: 1,
                header: 1,
                name: tableName,
                dataSet: dsName,
                computedColumns: []
            };
            tableColumns.forEach(function (item) {
                if (item.selected) {
                    var row = {
                        name: item.columnName,
                        displayName: item.displayName,
                        nativeDataType: item.nativeColumnType
                    };
                    res.computedColumns.push(row);
                }
            });
            res.col = res.computedColumns.length;
            if (settingHelper.element !== null && (settingHelper.container !== null && settingHelper.container.name === 'grid')) {
                res.parentId = settingHelper.element.id;
            }
            return request.request(url.createTable, 'POST', res).then(function (data) {
                return {
                    data: data.data,
                    structure: res
                }
            }, function (dataError) {
                console.log(dataError);
                $('#tablesModal').modal('hide');
            });
        }

        function setFilters(filters) {
            if (filters.length !== 0) {
                return request.request(url.dataSetFilters, "POST", filters).then(function (filtersData) {
                    return filters
                });
            }
            else {
                return [];
            }
        }
    }
})();