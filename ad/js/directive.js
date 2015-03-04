(function () {
    'use strict';

    angular.module('pcb.directives')
    .directive('pcb', ['d3', function(d3) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                label: "@",
                onClick: "&"
            },

            link: function(scope, iElement, iAttrs) {
                var svg = d3.select(iElement[0])
                .append("svg")
                .attr("width", "100%")
                .attr("height", "1000px");

                window.onresize = function() {
                    return scope.$apply();
                };

                scope.$watch(function() {
                        return angular.element(window)[0].innerWidth;
                    }, function() {
                        return scope.render(scope.data);
                    }
                );

                scope.$watch('data', function(new_values, old_values) {
                    return scope.render(new_values);
                }, true);

                var find_orientation = function (d) {
                    return (d.x2 - d.x1) == (d.y2 - d.y1);
                };

                function diamond_angle(d) {

                    var dx = d.x2 - d.x1;
                    var dy = d.y2 - d.y1;

                    if (dy >= 0) {
                        return (dx >= 0 ?   dy/( dx+dy) : 1-dx/(-dx+dy));
                    } else {
                        return (dx <  0 ? 2-dy/(-dx-dy) : 3+dx/( dx-dy));
                    }
                }

                var drag = d3.behavior.drag()
                    .on("drag", function(d) {

                        var angle = diamond_angle(d);

                        switch (angle) {
                        case 0.0:
                        case 2.0:
                        case 4.0:
                            console.log("horizontal");
                            d.y1 += d3.event.dy;
                            d.y2 += d3.event.dy;
                            break;

                        case 0.5:
                        case 2.5:
                            console.log("falling");
                            d.x2 += d3.event.dx;
                            d.y1 -= d3.event.dx;
                            break;

                        case 1.0:
                        case 3.0:
                            console.log("vertical");
                            d.x1 += d3.event.dx;
                            d.x2 += d3.event.dx;
                            break;

                        case 1.5:
                        case 3.5:
                            console.log("rising");
                            d.x1 += d3.event.dx;
                            d.y2 += d3.event.dx;
                            break;

                        default:
                            console.log("other angle");
                            d.x1 += d3.event.dx;
                            break;
                        }

                        scope.$apply();
                    });

                scope.render = function(data) {

                    svg.selectAll("*").remove();

                    svg.selectAll("line")
                        .data(data)
                        .enter()
                        .append("line")
                        .on("click", function(d, i){ return scope.onClick({trace: d});})
                        .attr("style", "stroke:#4f4")
                        .attr("stroke-width", "40px")
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-linecap", "round")
                        .attr("x1", function(d, i) { return d.x1; })
                        .attr("y1", function(d, i) { return d.y1; })
                        .attr("x2", function(d, i) { return d.x2; })
                        .attr("y2", function(d, i) { return d.y2; })
                        .call(drag);

                    svg.selectAll("text")
                        .data(data)
                        .enter()
                        .append("text")
                        .attr("fill", "#fff")
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .attr("font-weight", "bold")
                        .attr("x", function(d, i) { return d.x1 + (d.x2 - d.x1)/2; })
                        .attr("y", function(d, i) { return d.y1 + (d.y2 - d.y1)/2; })
                        .text(function(d) { return d[scope.label];});
                };
            }
        };
    }]);
}());
