// test if the Mandelbrot formula is diverging at this point
// return 1 if there is divergence
// otherwise returns the number of steps needed to reach norm of 4
function conv(x, y, nmax)
{
	// trivial tests
	if (x*x + y*y > 4) return 1;
	if (x*x + y*y < 0.0625) return 0;
	if ((x+1)*(x+1) + y*y < 0.0625) return 0;
	
	// regular divergence testing
	var xtemp=0, ytemp=0, xtemp2=0;
	var coef = 1e20;
	for (var j=0; j < nmax;j++)
	{
		xtemp2 = (coef*(xtemp*coef)*(xtemp*coef)/(coef*coef) - coef*(ytemp*coef)*(ytemp*coef)/(coef*coef) +coef*x)/coef;
		ytemp = (coef*2*(xtemp*coef)*(ytemp*coef)/(coef*coef) +coef*y)/coef;
		xtemp = xtemp2;
		if (xtemp*xtemp+ytemp*ytemp>4) return j;
	}
	
	return 0;     
}

// calculate the picture for a given position, sizes and step limit
function calculate(xmil, xsize, ymil, ysize, squares, nlimit)
{
	result = [];
    var k=0;
	var l=0;
	var coef = 1e20;
	var n = 0;
	for (var i=0;i<500;i++)
	{
		n++;
		for (var j=0;j<500;j++)
		{
			var y=(((ymil*coef)+(ysize*coef)/2)-i*(ysize*coef)/squares)/coef;
			var x=(((coef*xmil)-(xsize*coef)/2)+j*(xsize*coef)/squares)/coef;
			var limit = conv(x,y,nlimit);
			result.push([x,y,limit]);
		}
		l++;   
	}
	return result;
}

function update(xlength,ylength,xcenter,ycenter, nlimit)
{
	var width = 500;
	var height = 500;
	
	var nSide = width/1;
	
	var datas = calculate(xcenter,xlength,ycenter,ylength,nSide,nlimit);
	
	// Get the canvas and context
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
 
    // Define the image dimensions
    var width = canvas.width;
    var height = canvas.height;
 
    // Create an ImageData object
    var imagedata = context.createImageData(width, height);
	
	for (var i=0;i<datas.length; i++)
	{
		var pixelindex = i * 4;
 
		// Generate a xor pattern with some random noise
		var red;
		var green;
		var blue;

		if (datas[i][2] == 0)
		{
			red = 1;
			green = 1;
			blue = 1;
		} else
		{
			red = Math.round(254*datas[i][2]/nlimit);
			green = 0;
			blue = 0;
		}

		// Set the pixel data
		imagedata.data[pixelindex] = red;     // Red
		imagedata.data[pixelindex+1] = green; // Green
		imagedata.data[pixelindex+2] = blue;  // Blue
		imagedata.data[pixelindex+3] = 255;   // Alpha
	}
	
	context.putImageData(imagedata, 0, 0);
}

// test if the Mandelbrot formula is diverging at this point
// return 1 if there is divergence
// otherwise returns the number of steps needed to reach norm of 4
function convJulia(x, y, nmax, xjulia,yjulia)
{
	// regular divergence testing
	var xtemp=x, ytemp=y, xtemp2=0;
	var coef = 1e20;
	for (var j=0; j < nmax;j++)
	{
		xtemp2 = xtemp*xtemp-ytemp*ytemp+xjulia;
		ytemp = 2*xtemp*ytemp+yjulia;
		xtemp = xtemp2;
		if (xtemp*xtemp+ytemp*ytemp>4) return j;
	}
	
	return 0;     
}

// calculate the picture for a given position, sizes and step limit
function calculateJulia(xmil, xsize, ymil, ysize, squares, nlimit, xjulia, yjulia)
{
	result = [];
    var k=0;
	var l=0;
	var coef = 1e20;
	var n = 0;
	for (var i=0;i<500;i++)
	{
		n++;
		for (var j=0;j<500;j++)
		{
			var y=(((ymil*coef)+(ysize*coef)/2)-i*(ysize*coef)/squares)/coef;
			var x=(((coef*xmil)-(xsize*coef)/2)+j*(xsize*coef)/squares)/coef;
			var limit = convJulia(x,y,nlimit,xjulia,yjulia);
			result.push([x,y,limit]);
		}
		l++;   
	}
	return result;
}

function updateJulia(xlength,ylength,xcenter,ycenter, nlimit,xjulia,yjulia)
{
	var width = 500;
	var height = 500;
	
	var nSide = width/1;
	
	var datas = calculateJulia(xcenter,xlength,ycenter,ylength,nSide,nlimit,xjulia,yjulia);
	
	// Get the canvas and context
    var canvas = document.getElementById("viewportJulia"); 
    var context = canvas.getContext("2d");
 
    // Define the image dimensions
    var width = canvas.width;
    var height = canvas.height;
 
    // Create an ImageData object
    var imagedata = context.createImageData(width, height);
	
	for (var i=0;i<datas.length; i++)
	{
		var pixelindex = i * 4;
 
		// Generate a xor pattern with some random noise
		var red;
		var green;
		var blue;

		if (datas[i][2] == 0)
		{
			red = 1;
			green = 1;
			blue = 1;
		} else
		{
			red = Math.round(254*datas[i][2]/nlimit);
			green = 0;
			blue = 0;
		}

		// Set the pixel data
		imagedata.data[pixelindex] = red;     // Red
		imagedata.data[pixelindex+1] = green; // Green
		imagedata.data[pixelindex+2] = blue;  // Blue
		imagedata.data[pixelindex+3] = 255;   // Alpha
	}
	
	context.putImageData(imagedata, 0, 0);
}

$( document ).ready(function() {
	console.log( "ready!" );
	
	// default initialization of the Mandelbrot picture
	update(4,4,-0.5,0,200);
	
	// default initialization of the Mandelbrot picture
	updateJulia(4,4,0,0,200,0.3,0.5);
	
	// update by clicking on the button
	$( "#update" ).click(function() {
		//console.log( "update!" );
		//$("#graph").empty();
		var zoom = parseFloat($( "#zoom" ).val().replace(',', '.'));
		var xlength = 4/zoom;
		var ylength = 4/zoom;
		var xcenter = parseFloat($( "#xcenter" ).val().replace(',', '.'));
		var ycenter = parseFloat($( "#ycenter" ).val().replace(',', '.'));
		var nlimit = $( "#limit" ).val();
		update(xlength,ylength,xcenter,ycenter,nlimit);
	});
	
	// update by clicking on the picture
	$('#viewport').click(function(e) {
		var offset = $(this).offset();
		var pixelX = e.pageX - offset.left;
		var pixelY = e.pageY - offset.top;
		var zoom = parseFloat($( "#zoom" ).val().replace(',', '.'));
		var xcenterTemp = parseFloat($( "#xcenter" ).val().replace(',', '.'))+4*(pixelX-250)/(zoom*500);
		var ycenterTemp = parseFloat($( "#ycenter" ).val().replace(',', '.'))-4*(pixelY-250)/(zoom*500);
		var xlength = 4/(2*zoom);
		var ylength = 4/(2*zoom);
		var roundFactor = 100*Math.pow(10, Math.floor(Math.log(10*zoom)));
		var xcenter = Math.floor(roundFactor*xcenterTemp)/roundFactor;
		var ycenter = Math.floor(roundFactor*ycenterTemp)/roundFactor;
		$( "#xcenter" ).val(xcenter);
		$( "#ycenter" ).val(ycenter);
		$( "#zoom" ).val(2*zoom);
		$("#graph").empty();
		var nlimit = $( "#limit" ).val();
		update(xlength,ylength,xcenter,ycenter,nlimit);
	});
	
	// reset
	$('#reset').click(function(e) {
		var zoom = 0.5;
		var xcenter = -0.5;
		var ycenter = 0;
		$( "#xcenter" ).val(xcenter);
		$( "#ycenter" ).val(ycenter);
		$( "#zoom" ).val(2*zoom);
		//$("#graph").empty();
		update(4,4,-0.5,0);
	});
	
	// update by clicking on the button
	$( "#updateJulia" ).click(function() {
		//console.log( "update!" );
		//$("#graph").empty();
		var zoom = parseFloat($( "#zoomJulia" ).val().replace(',', '.'));
		var xlength = 4/zoom;
		var ylength = 4/zoom;
		var xcenter = parseFloat($( "#xcenterJulia" ).val().replace(',', '.'));
		var ycenter = parseFloat($( "#ycenterJulia" ).val().replace(',', '.'));
		var xjulia = parseFloat($( "#xJulia" ).val());
		var yjulia = parseFloat($( "#yJulia" ).val());
		var nlimit = parseFloat($( "#limitJulia" ).val());
		updateJulia(xlength,ylength,xcenter,ycenter,nlimit,xjulia,yjulia);
		console.log(xlength + " " + ylength + " " + xcenter + " " + ycenter + " " + nlimit + " " + xjulia + " " + yjulia)
	});
	
	// update by clicking on the picture
	$('#viewportJulia').click(function(e) {
		var offset = $(this).offset();
		var pixelX = e.pageX - offset.left;
		var pixelY = e.pageY - offset.top;
		var zoom = parseFloat($( "#zoomJulia" ).val().replace(',', '.'));
		var xcenterTemp = parseFloat($( "#xcenterJulia" ).val().replace(',', '.'))+4*(pixelX-250)/(zoom*500);
		var ycenterTemp = parseFloat($( "#ycenterJulia" ).val().replace(',', '.'))-4*(pixelY-250)/(zoom*500);
		var xlength = 4/(2*zoom);
		var ylength = 4/(2*zoom);
		var roundFactor = 100*Math.pow(10, Math.floor(Math.log(10*zoom)));
		var xcenter = Math.floor(roundFactor*xcenterTemp)/roundFactor;
		var ycenter = Math.floor(roundFactor*ycenterTemp)/roundFactor;
		var xjulia = parseFloat($( "#xJulia" ).val());
		var yjulia = parseFloat($( "#yJulia" ).val());
		$( "#xcenterJulia" ).val(xcenter);
		$( "#ycenterJulia" ).val(ycenter);
		$( "#zoomJulia" ).val(2*zoom);
		$("#graphJulia").empty();
		var nlimit = $( "#limitJulia" ).val();
		updateJulia(xlength,ylength,xcenter,ycenter,nlimit,xjulia,yjulia);
	});
	
	// reset
	$('#resetJulia').click(function(e) {
		var zoom = 0.5;
		var xcenter = 0;
		var ycenter = 0;
		$( "#xcenterJulia" ).val(xcenter);
		$( "#ycenterJulia" ).val(ycenter);
		$( "#zoomJulia" ).val(2*zoom);
		$( "#xJulia" ).val(0.3);
		$( "#yJulia" ).val(0.5);
		//$("#graph").empty();
		updateJulia(4,4,0,0,200,0.3,0.5);
	});
	
	// Menu buttons
	$( "#MandelbrotButton" ).click(function() {
		$( "#rowMandelbrot" ).show();
		$( "#rowJulia" ).hide();
		$( "#rowAbout" ).hide();
	});
	$( "#JuliaButton" ).click(function() {
		$( "#rowMandelbrot" ).hide();
		$( "#rowJulia" ).show();
		$( "#rowAbout" ).hide();
	});
	$( "#AboutButton" ).click(function() {
		$( "#rowMandelbrot" ).hide();
		$( "#rowJulia" ).hide();
		$( "#rowAbout" ).show();
	});
});