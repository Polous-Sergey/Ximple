(function () {
    'use strict';

    angular
        .module('startApp')
        .factory('elementsModel', elementsModel);

    elementsModel.$inject = ['defaultStyleModel'];

    function elementsModel(defaultStyleModel) {

        var positionCnt = 0;
        var idCnt = 0;
        return {
            containerModel: containerModel,
            labelModel: labelModel,
            tableModel: tableModel,
            tableColumn: tableColumn,
            tableModelDataSet: tableModelDataSet,
            gridModel: gridModel
        };


        function containerModel() {
            return {
                id: ++idCnt,
                name: 'container',
                type: 'container',
                style: {
                    "margin-left": "0",
                    "margin-top": "0",
                    "margin-right": "0",
                    "margin-bottom": "0",
                    "fontSize": "14",
                    "font-weight": "600",
                    "text-align": 'left',
                    "width": "250",
                    "widthUnit": "px",
                    "height": "150",
                    "heightUnit": "px",
                    "border": '1px solid #ccc'
                },
                selected: false,
                elements: []
            };
        }

        function labelModel(id) {
            return {
                id: id,
                position: ++positionCnt,
                name: 'label',
                type: 'label',
                value: '',
                style: defaultStyleModel.labelStyleModel(),
                selected: false,
                elements: []
            };
        }

        function tableModelDataSet(obj, dataSetId, tableColumns) {
            var deleteColumns = [];
            function createTable() {
                var tableStructure = {
                    head: [],
                    body: [],
                    footer: []
                };
                var rowBlock = [];
                if(tableColumns !== undefined){
                    tableColumns.forEach(function (item, i) {
                        if (!item.selected) {
                            deleteColumns.push(item);
                        }
                        else{
                            rowBlock.push(item);
                        }
                    });

                    obj.header.rows[0].cells.forEach(function (item, i) {
                        rowBlock[i].id = item.id;
                        rowBlock[i].rowType = 'header';
                        rowBlock[i].value = item.childrens[0].text;
                        rowBlock[i].style = defaultStyleModel.tableHeaderModel(obj.header.rows[0].length);
                    });
                }
                else{
                    obj.header.rows[0].cells.forEach(function (item, i) {
                        var columnItem = {
                            id: item.id,
                            rowType: 'header',
                            value: item.childrens[0].text,
                            style: defaultStyleModel.tableHeaderModel(obj.header.rows[0].length)
                        };
                        rowBlock.push(columnItem);
                    });
                }

                tableStructure.head.push(rowBlock);

                obj.detail.rows.forEach(function (item) {
                    var rowBlock = {
                        style: defaultStyleModel.tableRowModel(),
                        row: []
                    };

                    item.cells.forEach(function (cell) {
                        var columnItem = {
                            id: cell.id,
                            rowType: 'body',
                            value: '',
                            style: defaultStyleModel.tableCellModel()
                        };
                        rowBlock.row.push(columnItem);
                    });
                    tableStructure.body.push(rowBlock);
                });

                return tableStructure;
            }

            return {
                id: obj.id,
                dataSetID: dataSetId,
                name: 'table',
                type: 'table',
                tableStructure: createTable(),
                columnNum: obj.columns.length,
                rowNum: obj.header.rows.length + obj.detail.rows.length + obj.footer.rows.length,
                style: {},
                selected: false,
                elements: [],
                deleteColumns : deleteColumns
            };
        }

        function tableColumn(item, column) {

            var head = {
                id: item.headerCells[0].id,
                rowType:'header',
                style:defaultStyleModel.tableHeaderModel(5),
                value:column.displayName
            };


            var body = {
                id: item.detailCells[0].id,
                rowType:'body',
                style: defaultStyleModel.tableCellModel(),
                value:''
            };

            return {
                head: head,
                body: body
            };
        }

        function tableModel(column, row, headerNames) {
            function createTable() {
                var tableStructure = {
                    head: [],
                    body: [],
                    footer: []
                };
                var rowBlock = [];
                for (var j = 0; j < column; j++) {
                    var columnItem = {
                        id: ++idCnt,
                        rowType: 'header',
                        value: headerNames ? headerNames[j] : 'Header' + "=" + j,
                        style: defaultStyleModel.tableHeaderModel(column)
                    };
                    rowBlock.push(columnItem);
                }
                tableStructure.head.push(rowBlock);


                for (var i = 0; i < row; i++) {
                    var rowBlock = {
                        style: defaultStyleModel.tableRowModel(),
                        row: []
                    };
                    for (var j = 0; j < column; j++) {
                        var columnItem = {
                            id: ++idCnt,
                            rowType: 'body',
                            value: headerNames ? '<' + headerNames[j] + '>' : 'Header' + "=" + j,
                            style: defaultStyleModel.tableCellModel()
                        };
                        rowBlock.row.push(columnItem);
                    }
                    tableStructure.body.push(rowBlock)
                }

                var footerBlock = [];
                for (var j = 0; j < column; j++) {
                    var columnItem = {
                        id: ++idCnt,
                        rowType: 'footer',
                        value: headerNames ? headerNames[j] : 'Footer' + "=" + j,
                        style: defaultStyleModel.tableHeaderModel(column)
                    };
                    footerBlock.push(columnItem);
                }
                tableStructure.footer.push(rowBlock);
                return tableStructure;
            }

            return {
                id: ++idCnt,
                name: 'table',
                type: 'table',
                tableStructure: createTable(),
                columnNum: column,
                rowNum: row,
                style: {},
                selected: false,
                elements: []
            };
        }

        function gridModel(data) {
            console.log(data);

            function createGrid() {
                var gridStructure = {
                    column: data.columns,
                    rows: data.rows
                };
                for (var i = 0; i < gridStructure.column.length; i++) {
                    gridStructure.column[i].style = defaultStyleModel.gridColumnModel(gridStructure.column.length);
                }
                for (var i = 0; i < gridStructure.rows.length; i++) {
                    gridStructure.rows[i].style = defaultStyleModel.gridRowModel();
                    for (var j = 0; j < gridStructure.rows[i].cells.length; j++) {
                        gridStructure.rows[i].cells[j].style = defaultStyleModel.gridCellModel(gridStructure.rows[i].cells.length);
                    }
                }

                return gridStructure;
            }

            return {
                id: data.id,
                name: data.elementName,
                type: 'grid',
                gridStructure: createGrid(),
                columnNum: data.columns.length,
                rowNum: data.rows[0].cells.length,
                style: {},
                selected: false,
                elements: []
            };
        }
    }
})();