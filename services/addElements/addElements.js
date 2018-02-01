;(function () {
    'use strict';

    angular
        .module('factory.addElements', [])
        .factory('addElements', addElements);

    addElements.$inject = ['settingHelper', 'request', 'url', 'elementsModel', 'modelReport', 'dataSourcesParams', 'refactorObj', 'user'];

    function addElements(settingHelper, request, url, elementsModel, modelReport, dataSourcesParams, refactorObj, user) {
        var dataSetCnt = 0;
        var standartFilters = [];
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
                if (item.selected) {
                    var obj = {};
                    obj.name = item.columnName;
                    obj.dataType = item.columnType;
                    obj.analysis = "dimension";
                    obj.nativeName = item.columnName;
                    obj.displayName = item.displayName;
                    obj.position = String(index + 1);
                    obj.nativeColumnType = String(item.nativeColumnType);
                    result.push(obj);
                }
            });
            return result
        }


        function foreacerFunc2(data) {
            var test = user.getUser().userCompany;
            var values = {
                PWDPRODUCT: {
                    expression: "PRCOMPANY",
                    firstPropertyList: ["00013"],
                    operation: "eq"
                },
                PWDPRODID: {
                    expression: "PICOMPANY",
                    firstPropertyList: ["00013"],
                    operation: "eq"
                },
                COSTCENTW: {
                    expression: "COMPANY",
                    firstPropertyList: ["00013"],
                    operation: "eq"
                }
            };

            return angular.forEach(values, function (value, key) {
                if (key === data) {
                    standartFilters.push(value);
                }
            });
        }

        function tableJoin(joinData, filters) {

            standartFilters = [];

            joinData.forEach(function (item) {
                foreacerFunc2(item.firstTable.tableName);
                foreacerFunc2(item.secondTable.tableName);
            });

            filters = filters.concat(standartFilters);
            var joinDataSetName = 'jds' + (++dataSetCnt);

            next();

            function next() {
                var joinObj = {};
                return newDataSet().then(function (data) {
                    joinObj = {
                        id: data.dataSetId,
                        rowFetchLimit: 50,
                        listTables: [],
                        joinConditions: []
                    };
                    joinData.forEach(function (item, index) {
                        var firstSelectedColumns = [];
                        var secondSelectedColumns = [];
                        var causesForSelectedColumns = [];
                        var neznayu = [];
                        item.selectColumns.forEach(function (el, index) {
                            firstSelectedColumns.push(el.joinColumn);
                            secondSelectedColumns.push(el.inverseJoinColumn);
                            if (index !== 0) {
                                causesForSelectedColumns.push(el.type);
                            }
                            if (index === item.selectColumns.length - 1) {
                                causesForSelectedColumns.push('');
                            }
                            neznayu.push(' = ');

                        });
                        var tmpObj1 = [
                            {
                                tableName: item.firstTable.tableName,
                                columns: []
                            }, {
                                tableName: item.secondTable.tableName,
                                columns: item.secondColumns
                            }
                        ];

                        tmpObj1[0].columns = foreacerFunc(item.firstColumns);
                        tmpObj1[1].columns = foreacerFunc(item.secondColumns);

                        var tmpObj2 = {
                            firstTable: index,
                            secondTable: index + 1,
                            type: joinData[index].type,
                            firstColumns: firstSelectedColumns,
                            secondColumns: secondSelectedColumns,
                            causes: causesForSelectedColumns,
                            operators: neznayu
                        };
                        joinObj.listTables.push(tmpObj1[0]);
                        joinObj.listTables.push(tmpObj1[1]);
                        joinObj.joinConditions.push(tmpObj2);
                    });

                    return request.request(url.odajoinDataSet(joinObj.id), 'POST', joinObj).then(function () {
                        return createTable(joinDataSetName, "", joinData).then(function (data) {
                            request.request(url.filtersForDataSet(joinObj.id), 'POST', filters).then(function () {
                                showTable(data);

                                function showTable(data) {
                                    var table = elementsModel.tableModelDataSet(data.data, data.data.id, joinData);
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
                        })
                    })

                });
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
                item.firstColumns.forEach(function (item) {
                    if (item.selected) {
                        var row = {
                            name: item.columnName,
                            displayName: item.displayName,
                            nativeDataType: item.nativeColumnType
                        };
                        res.computedColumns.push(row);
                    }
                });
                item.secondColumns.forEach(function (item) {
                    if (item.selected) {
                        var row = {
                            name: item.columnName,
                            displayName: item.displayName,
                            nativeDataType: item.nativeColumnType
                        };
                        res.computedColumns.push(row);
                    }
                })
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