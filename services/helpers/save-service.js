(function () {
    'use strict';

    angular
        .module('startApp')
        .factory('saveQueue', saveQueue);

    saveQueue.$inject = ['request', 'url'];

    function saveQueue(request, url) {

        var tempElement;
        var deletedElement;

        return {
            clearLastElemetn: clearLastElemetn,
            saveElement: saveElement,
            saveLastElement: saveLastElement
        };

        function clearLastElemetn(element) {
            deletedElement = element;
            tempElement = null;
        }

        function saveLastElement() {
            if (tempElement === undefined || tempElement === null || !tempElement.hasOwnProperty('container')) return;
            switch (tempElement.container.type) {
                case 'label':
                    labelSave(tempElement);
                    break;
                case 'grid':
                    gridSave(tempElement);
                    break;
            }
        }

        function saveElement(newVal, oldVal) {
            preSaveCheck(newVal, oldVal);
        }


        function preSaveCheck(newVal, oldVal) {
            console.log(deletedElement);
            if (oldVal.element === null || deletedElement === oldVal.element.id) return false;
            switch (oldVal.container.type) {
                case 'label':
                    labelCheck(newVal, oldVal);
                    break;
                case 'grid':
                    gridCheck(newVal, oldVal);
                    break;
            }
        }

        function labelSave(labelData) {
            var temp = labelData.element;
            var copy = angular.copy(temp);
            copy.style.fontSize = copy.style.fontSize + copy.style.fontSizeUnit;
            delete copy.style.fontSizeUnit;
            delete copy.style.border;
            var saveData = {
                "id": copy.id,
                "position": copy.position,
                "text": copy.value,
                "properties": copy.style
            };
            return request.request(url.createLabel, "PUT", saveData).then(function (data) {
                return data;
            });
        }

        function gridSave(gridData) {
            var copy = angular.copy(gridData.container);
            var grid = {
                id: copy.id,
                children: []
            };
            copy.gridStructure.column.forEach(function (col) {
                var colTemp = {
                    id: col.id,
                    properties: col.style
                };
                colTemp.properties['width'] += colTemp.properties['widthUnit'];
                delete colTemp.properties['widthUnit'];
                grid.children.push(colTemp);
            });
            copy.gridStructure.rows.forEach(function (row) {
                var rowTemp = {
                    id: row.id,
                    properties: row.style
                };
                rowTemp.properties['height'] += rowTemp.properties['heightUnit'];
                delete rowTemp.properties['heightUnit'];
                grid.children.push(rowTemp);
            });
            copy.gridStructure.rows.forEach(function (row) {
                row.cells.forEach(function (row) {
                    var cellTemp = {
                        id: row.id,
                        properties: row.style
                    };
                    cellTemp.properties['paddingTop'] += 'px';
                    cellTemp.properties['paddingRight'] += 'px';
                    cellTemp.properties['paddingBottom'] += 'px';
                    cellTemp.properties['paddingLeft'] += 'px';
                    grid.children.push(cellTemp);
                });
            });
            return request.request(url.createGrid, "PUT", grid).then(function (data) {
                console.log(data);
                return data;
            });
        }

        function labelCheck(newVal, oldVal) {
            if (newVal.element !== null) {
                if (newVal.element.id === oldVal.element.id) return false;
            }
            labelSave(oldVal);
            tempElement = newVal;
        }

        function gridCheck(newVal, oldVal) {
            if (newVal.element !== null) {
                if (newVal.container.id === oldVal.container.id) return false;
            }
            gridSave(oldVal);
            tempElement = newVal;
        }
    }
})();