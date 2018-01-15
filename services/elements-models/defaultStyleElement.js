(function () {
    'use strict';

    angular
        .module('startApp')
        .factory('defaultStyleModel', defaultStyleModel);

    defaultStyleModel.$inject = [];

    function defaultStyleModel() {

        return {
            tableHeaderModel: tableHeaderModel,
            tableCellModel: tableCellModel,
            tableRowModel: tableRowModel,
            labelStyleModel: labelStyleModel,
            gridRowModel: gridRowModel,
            gridCellModel: gridCellModel,
            gridColumnModel: gridColumnModel
        };


        function tableHeaderModel(column) {
            return {
                'background-color': '#BBBBBB',
                'width': 100 / column,
                'widthUnit': '%',
                'height': 30,
                'heightUnit': 'px',
                'font-size': 14,
                'color': '#000000',
                'text-align': 'center'
            }
        }

        function tableRowModel() {
            return {
                'height': 20,
                'heightUnit': 'px'
            }
        }

        function tableCellModel(width) {
            return {
                'background': '#4CAF50;',
                'font-size': 14,
                'color': '#000000',
                'text-align': 'center',
                'border-width': '1px',
                'border-style': 'solid',
                'border-color': '#ccc',
                'height': 30,
                'heightUnit': 'px'
            }
        }

        function labelStyleModel() {
            return {
                'marginLeft': 0,
                'marginTop': 0,
                'marginRight': 0,
                'marginBottom': 0,
                'paddingLeft': 0,
                'paddingTop': 0,
                'paddingRight': 0,
                'paddingBottom': 0,
                'fontSize': 14,
                'fontSizeUnit': 'px',
                'fontWeight': 'normal',
                'fontStyle': 'normal',
                'textAlign': 'left',
                'border': '1px solid #ccc',
                'backgroundColor': '#ffffff',
                'color': '#000000',
                'borderTopWidth': '1px',
                'borderTopColor': '#000000',
                'borderTopStyle': 'solid',
                'borderRightWidth': '1px',
                'borderRightColor': '#000000',
                'borderRightStyle': 'solid',
                'borderBottomWidth': '1px',
                'borderBottomColor': '#000000',
                'borderBottomStyle': 'solid',
                'borderLeftWidth': '1px',
                'borderLeftColor': '#000000',
                'borderLeftStyle': 'solid'
            }
        }

        function gridColumnModel(row) {
            return {
                'width': 100 / row,
                'widthUnit': '%'
            }
        }

        function gridRowModel() {
            return {
                'height': 50 ,
                'heightUnit': 'px'
            }
        }

        function gridCellModel(row) {
            return {
                'paddingTop': 10,
                'paddingRight': 10,
                'paddingBottom': 10,
                'paddingLeft': 10
            }
        }
    }
})();