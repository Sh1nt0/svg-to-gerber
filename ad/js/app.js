(function () {
    'use strict';

    angular.module('d3', []);
    angular.module('pcb.controllers', []);
    angular.module('pcb.directives', ['d3']);
    angular.module('pcb', ['pcb.controllers', 'pcb.directives']);

}());
