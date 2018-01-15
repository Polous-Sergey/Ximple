(function () {
    'use strict';

    angular
        .module('startApp')
        .controller('paperCtrl', paperCtrl);

    paperCtrl.$inject = ['$scope'];

    function paperCtrl($scope) {
        var vm = this;

        vm.addTab = addTab;
        vm.closeTab = closeTab;
        vm.selectTab = selectTab;
        vm.editName = editName;
        vm.tabsList = [
            {
                name: "tab 1",
                selected: true
            }
        ];


        $scope.$watch('vm.model', function (model) {
           // console.log(model);
        }, true);
        


        function addTab() {
            var item = {
                name: "tabs" + (vm.tabsList.length + 1)
            };
            if (vm.tabsList.length === 0)
                item.selected = true;
            vm.tabsList.push(item);
        }

        function closeTab(indexElement) {
            vm.tabsList.splice(indexElement, 1);
            if (vm.tabsList.length > 0 && vm.tabsList.length >= indexElement) {
                vm.tabsList[0].selected = true;
            }
        }

        function selectTab(index) {
            vm.tabsList.forEach(function (item, i, arr) {
                item.selected = false;
            });
            vm.tabsList[index].selected = true;
        }

        function editName(event) {
            var input = event.target.parentElement.getElementsByTagName('input')[0];
            input.removeAttribute("readonly");
            input.focus();
            input.setSelectionRange(0, input.value.length)
        }
    }
})();