(function () {
    'use strict';

    angular.module('pcb.controllers')
    .controller('pcb_controller', ['$scope', function($scope){

        $scope.netname = "PCB";

        $scope.traces = [
            {x1: 100, y1: 100, x2: 100, y2: 200, netname:"VCC"},
            {x1: 100, y1: 200, x2: 400, y2: 500, netname:"VCC"},
            {x1: 400, y1: 500, x2: 500, y2: 500, netname:"VCC"},
            {x1: 500, y1: 300, x2: 500, y2: 200, netname:"GND"},
            {x1: 400, y1: 400, x2: 500, y2: 300, netname:"GND"}
        ];

        $scope.trace_on_click = function(trace){
            $scope.netname = trace.netname;
            $scope.$apply();
        };
    }]);
}());
