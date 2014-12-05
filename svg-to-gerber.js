function convert_coordinate_format(coord) {

    /* Remove non-numbers*/
    //coord = coord.match(/\d+/);

    /* Get the integer part */
    var integer = Math.floor(coord);

    /* Get the fraction part, truncate it to 6 decimals, and remove the decimal point */
    var fraction = (coord % 1).toFixed(6) * 1e6;

    console.log(integer);
    console.log(fraction);

    return "" + integer + fraction
}

//svg = document.getElementsByTagName("svg")[0];
//svg.setAttribute("viewBox", "0 0 1000 1000");
//svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

var pcb = Snap("#pcb");
var pad = pcb.select("#pad");

var points;
pcb.select("#track").drag(
function(dx, dy, x, y, e) {
    console.log(dx);
    console.log(dy);
    points[0] = +points[0] + dx;
    points[1] = +points[1] + 0;
    points[2] = +points[2] + dx;
    points[3] = +points[3] + dx
    this.attr({"points": points});
    points[0] = +points[0] - dx;
    points[1] = +points[1] - 0;
    points[2] = +points[2] - dx;
    points[3] = +points[3] - dx;
},
function(x, y, e) {
    points = this.attr("points");
});

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
