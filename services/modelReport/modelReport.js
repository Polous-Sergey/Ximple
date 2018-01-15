(function () {
    'use strict';

    angular
        .module('startApp')
        .factory('modelReport', modelReport);

    modelReport.$inject = [];

    function modelReport() {

        return {
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
                            "width": 100,
                            "widthUnit": '%',
                            "height": 100,
                            "heightUnit": '%',
                            "border": '1px solid #cccccc'
                        },
                        selected: true,
                        elements: []
                    }
                ]
            }
        }
    }
})();