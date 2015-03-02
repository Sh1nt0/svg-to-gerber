function convert_coordinate_format(coord) {

    /* Remove non-numbers*/
    //coord = coord.match(/\d+/);

    /* Get the integer part */
    var integer = Math.floor(coord);

    /* Get the fraction part, truncate it to 6 decimals, and remove the decimal point */
    var fraction = (coord % 1).toFixed(6) * 1e6;

    //console.log(integer);
    //console.log(fraction);

    return "" + integer + fraction
}

//svg = document.getElementsByTagName("svg")[0];
//svg.setAttribute("viewBox", "0 0 1000 1000");
//svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

var pcb = Snap("#pcb");
var pad = pcb.select("#pad");

var x1, y1, x2, y2;
var tracks = pcb.selectAll(".track");

var track = pcb.select("#middle");
track.paper.append( track );
track.drag(move, start);

//tracks.forEach( function(elem, i) {
//    elem.drag(move, start);
//    //elem.hover(highlight_trace, unhighlight_trace);
//});

function move(dx, dy, x, y, e) {
    var new_y1 = +y1 + (dy - dx);
    var new_x2 = +x2 - (dy - dx);

    if ((+y2 - new_y1) < 0 && (new_x2 - +x1) < 0) {
        new_y1 = y2;
        new_x2 = x1;
        this.remove();
    }

    this.attr({"y1": new_y1 });
    this.attr({"x2": new_x2 });

    connected_trace_one.attr({"y2": new_y1 });
    connected_trace_two.attr({"x1": new_x2 });
};

function start(x, y, e) {
    x1 = this.attr("x1");
    y1 = this.attr("y1");
    x2 = this.attr("x2");
    y2 = this.attr("y2");

    parentThis = this;

    tracks.forEach( function(elem, i) {
        if (parentThis != elem) {
            if (x1 == elem.attr("x1") || x1 == elem.attr("x2")) {
                if (y1 == elem.attr("y1") || y1 == elem.attr("y2")) {
                    connected_trace_one = elem;
                }
            }
            if (x2 == elem.attr("x1") || x2 == elem.attr("x2")) {
                if (y2 == elem.attr("y1") || y2 == elem.attr("y2")) {
                    connected_trace_two = elem;
                }
            }
        }
    });
};

//function highlight_trace(e) {
//    this.paper.append( this );
//    this.attr({ stroke: "#222" });
//};
//
//function unhighlight_trace(e) {
//    this.attr({ stroke: "#4f4" });
//};

/* Based on: http://www.ucamco.com/files/downloads/file/81/the_gerber_file_format_specification.pdf */

var gerber_code = "";

/* Comment */
gerber_code += "G04 svg-to-gerber*";

/*
 * Coordinate format specification:
 * Leading zero's omitted
 * Absolute coordinates
 * 2 digits in the integer part
 * 6 digits in the fractional part
*/
gerber_code += "%FSLAX26Y26*%";

/* Unit set to mm */
gerber_code += "%MOMM*%";

/* The file is not a layer of a PCB part - it is just an example. */
gerber_code += "%TF.Part,Other*%";

/* Start a new level with dark polarity */
gerber_code += "%LPD*%";

/* Aperture definition: D10 is a rectangle with size fetched from svg#pcb #pad */
gerber_code += "%ADD10R," + convert_coordinate_format(pad.attr("width")) + "X" + convert_coordinate_format(pad.attr("height")) + "*%";

/* Comment */
gerber_code += "G04 Start image generation";

/* Select aperture with D-code 10 */
gerber_code += "D10*";

/* Move to #pad x,y and flash */
gerber_code += "X" + convert_coordinate_format(pad.attr("x")) + "Y" + convert_coordinate_format(pad.attr("y")) + "D03*";

/* End of file */
gerber_code += "M02*";

console.log(gerber_code);
