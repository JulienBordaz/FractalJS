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
	console.clear();
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

function update(xlength,ylength,xcenter,ycenter)
{
	var width = 500;
	var height = 500;
	
	var nSide = width/1;
	
	var nlimit = $( "#limit" ).val();
	
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

$( document ).ready(function() {
	console.log( "ready!" );
	
	// default initialization of the picture
	update(4,4,-0.5,0);
	
	// update by clicking on the button
	$( "#update" ).click(function() {
		//console.log( "update!" );
		//$("#graph").empty();
		var zoom = parseFloat($( "#zoom" ).val().replace(',', '.'));
		var xlength = 4/zoom;
		var ylength = 4/zoom;
		var xcenter = parseFloat($( "#xcenter" ).val().replace(',', '.'));
		var ycenter = parseFloat($( "#ycenter" ).val().replace(',', '.'));
		update(xlength,ylength,xcenter,ycenter);
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
		update(xlength,ylength,xcenter,ycenter);
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
});