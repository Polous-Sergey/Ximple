;(function () {
    angular
        .module('app')
        .config(['cfpLoadingBarProvider','$compileProvider', '$uibTooltipProvider','$httpProvider',
            function (cfpLoadingBarProvider,$compileProvider,$uibTooltipProvider,$httpProvider) {
            cfpLoadingBarProvider.includeSpinner = true;
            $uibTooltipProvider.options({
                // popupCloseDelay : 2000,
                popupDelay: 500,
                placement: 'top'
            });
            // $httpProvider.interceptors.push('interceptors');
            // $compileProvider.debugInfoEnabled(false);
        }]);
})();

