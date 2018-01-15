(function () {
    'use strict';

    angular
        .module('startApp')
        .factory('dataServices', dataServices);

    dataServices.$inject = [];

    function dataServices() {

        return {
            dataSetName:'',
            dataSourcesName:'',
            dataSet: [],
            models: {
                container: [
                    {
                        name: 'container',
                        type: 'container',
                        style: {
                            "margin-left": 0,
                            "margin-top": 0,
                            "margin-right": 0,
                            "margin-bottom": 0,
                            "fontSize": 14,
                            "font-weight": 600,
                            "text-align": 'left',
                            "width": 100,
                            "widthUnit": '%',
                            "height": 100,
                            "heightUnit": '%',
                            "border": '1px solid #cccccc',
                            "background-color": '#ffffff'
                        },
                        selected: true,
                        elements: []
                    }
                ]
            }
        }
    }
})();