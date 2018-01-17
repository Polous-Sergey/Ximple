;(function () {
    angular
        .module('app')
        .controller('MsgItem', MsgItem);

    /* @ngInject */
    function MsgItem($scope, user, $timeout) {
        var vm = this;
        vm.unread = 0;
        vm.data = $scope.data;

        _init();

        function _init() {
            var messages = window.firebase.database().ref('msg/improvements/' + vm.data.id + '/unread/');
            messages.on('value', function (snapshot) {
                $timeout(function () {
                    if (snapshot.val() !== null) {
                        if (user.getUser().role === 1) {
                            vm.unread = snapshot.val().user;
                        } else {
                            vm.unread = snapshot.val().system;
                        }
                    }
                });
            });
            $scope.$on("$destroy", function () {
                messages.off('value');
            });
        }
    }
})();