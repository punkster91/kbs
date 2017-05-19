﻿(function () {
    'use strict';
    var controllerId = 'meterFareController';
    angular.module('app')
        .controller(controllerId, ['$scope', 'common', 'momentService', 'meterFareDataService', 'datepickerService', 'timepickerService', meterFareController]);

    function meterFareController($scope, common, momentService, meterFareDataService, datepickerService, timepickerService) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var vm = this;
        
        vm.title = 'Calculate your expensive taxi cab fare!';
        vm.meterDateControl = datepickerService.initNewDatePicker(null);
        vm.meterTimeControl = timepickerService.initNewDatePicker(null);
        vm.milesTraveled = null;
        vm.minutesTraveled = null;
        $scope.totalFare = null;

        vm.submitForm = submitForm;
        vm.prefill = prefill;
        vm.resetForm = resetForm;
        
        // auto exec
        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                    console.log(vm.meterDateControl.name);

                    vm.meterDateControl.setData(new Date());
                    vm.meterTimeControl.setData(new Date());
                });
        }

        // calls the web api function to calculate total fare
        function calculateFareRequest(sMeterTime, iMilesTraveled, iMinutesTraveled) {
            // create api parameters from form arguments
            var httpParams = {
                params: {
                    meterTime: sMeterTime,
                    milesTraveled: iMilesTraveled,
                    minutesTraveled: iMinutesTraveled
                }
            };

            return meterFareDataService.calculateFare(httpParams)
                            .then(function (response) {
                                if (response.status == 200) {
                                    $scope.totalFare = response.data;
                                } else {
                                    $scope.totalFare = null;
                                }
                            });
        }

        // function to submit the form after all validation has occurred
        function submitForm(isValid) {

            vm.submitted = true;

            if (isValid) {
                // get meter date
                var meterDate = vm.meterDateControl.getData();
                var meterTime = vm.meterTimeControl.getData();
                var sMeterTime = momentService.combineDateAndTime(meterDate, meterTime).toISOString()
                calculateFareRequest(sMeterTime, vm.milesTraveled, vm.minutesTraveled);
            } else {
                // somethin something
            }
        }

        // NOT IN USE
        function resetForm() {
            $scope.totalFare = null;
        }

        // populates the form with random data
        function prefill() {
            var d = common.getRandomDate(new Date(2012, 0, 1), new Date());
            vm.meterDateControl.setData(d);
            vm.meterTimeControl.setData(d);
            vm.minutesTraveled = Math.floor(Math.random() * 100);
            vm.milesTraveled = Math.floor(Math.random() * 100);
        }
    }
})();