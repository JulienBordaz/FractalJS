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
	for (var j=0; j < nmax;j++)
	{
		xtemp2 = xtemp*xtemp - ytemp*ytemp +x;
		ytemp = 2*xtemp*ytemp +y;
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
	for (var i=ymil+ysize/2;i>=ymil-ysize/2; i=i-ysize/squares)
	{
		for (var j=xmil-xsize/2;j<=xmil+xsize/2; j=j+xsize/squares)
		{
			var limit = conv(j,i,nlimit);
			result.push([j,i,limit]);
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
	
	//console.log( "update2!" );
	
	var nlimit = 200;
	
	var datas = calculate(xcenter,xlength,ycenter,ylength,nSide,nlimit);
	
	//console.log(datas);
	
	var p = new PNGlib(500, 500, 256); // construcor takes height, weight and color-depth
	var background = p.color(0, 0, 0, 0); // set the background transparent

	for (var i=0;i<datas.length; i++)
	{
		//console.log("pouet");
		//Draw the Rectangle
		if (datas[i][2] == 0)
		{
			p.buffer[p.index(Math.round(width/2-width*xcenter/xlength + (width/xlength)*datas[i][0]), Math.round(height-(height/2-height*ycenter/ylength + (height/ylength)*datas[i][1])))] = p.color(1, 1, 1);
			//console.log(Math.round(width/2-width*xcenter/xlength + (width/xlength)*datas[i][0]), Math.round(height/2 + (height/ylength)*datas[i][1]));
		} else
		{
			p.buffer[p.index(Math.round(width/2-width*xcenter/xlength + (width/xlength)*datas[i][0]), Math.round(height-(height/2-height*ycenter/ylength + (height/ylength)*datas[i][1])))] = p.color(Math.round(254*datas[i][2]/nlimit), 0, 0);
		}
	}
	
	$("#graph").append('<img class="fractalPicture" src="data:image/png;base64,'+p.getBase64()+'">');
}

$( document ).ready(function() {
	console.log( "ready!" );
	
	// default initialization of the picture
	update(4,4,-0.5,0);
	
	// update by clicking on the button
	$( "#update" ).click(function() {
		//console.log( "update!" );
		$("#graph").empty();
		var zoom = parseFloat($( "#zoom" ).val().replace(',', '.'));
		var xlength = 4/zoom;
		var ylength = 4/zoom;
		var xcenter = parseFloat($( "#xcenter" ).val().replace(',', '.'));
		var ycenter = parseFloat($( "#ycenter" ).val().replace(',', '.'));
		update(xlength,ylength,xcenter,ycenter);
	});
	
	// update by clicking on the picture
	$('#graph').click(function(e) {
		var offset = $(this).offset();
		var pixelX = e.pageX - offset.left;
		var pixelY = e.pageY - offset.top;
		var zoom = parseFloat($( "#zoom" ).val().replace(',', '.'));
		var xcenterTemp = parseFloat($( "#xcenter" ).val().replace(',', '.'))+4*(pixelX-250)/(zoom*500);
		var ycenterTemp = parseFloat($( "#ycenter" ).val().replace(',', '.'))-4*(pixelY-250)/(zoom*500);
		var xlength = 4/(2*zoom);
		var ylength = 4/(2*zoom);
		var roundFactor = 100*Math.pow(10, Math.floor(Math.log(10*zoom)));
		console.log(roundFactor);
		var xcenter = Math.floor(roundFactor*xcenterTemp)/roundFactor;
		var ycenter = Math.floor(roundFactor*ycenterTemp)/roundFactor;
		$( "#xcenter" ).val(xcenter);
		$( "#ycenter" ).val(ycenter);
		$( "#zoom" ).val(2*zoom);
		$("#graph").empty();
		update(xlength,ylength,xcenter,ycenter);
	});
	
	
});