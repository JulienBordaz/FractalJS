function conv(x, y, nmax)
{
	// trivial tests
	if (x*x + y*y > 4) return 1;
	if (x*x + y*y < 0.0625) return 0;
	if ((x+1)*(x+1) + y*y < 0.0625) return 0;
	
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
	var width = 600;
	var height = 600;
	
	var nSide = width/1;
	
	//console.log( "update2!" );
	
	var nlimit = 50;
	
	var datas = calculate(xcenter,xlength,ycenter,ylength,nSide,nlimit);
	
	//console.log(datas);
	
	var p = new PNGlib(600, 600, 256); // construcor takes height, weight and color-depth
	var background = p.color(0, 0, 0, 0); // set the background transparent

	for (var i=0;i<datas.length; i++)
	{
		//console.log("pouet");
		//Draw the Rectangle
		if (datas[i][2] == 0)
		{
			p.buffer[p.index(Math.round(width/2-width*xcenter/xlength + (width/xlength)*datas[i][0]), Math.round(height/2 + (height/ylength)*datas[i][1]))] = p.color(1, 1, 1);
			//console.log(Math.round(width/2-width*xcenter/xlength + (width/xlength)*datas[i][0]), Math.round(height/2 + (height/ylength)*datas[i][1]));
		} else
		{
			p.buffer[p.index(Math.round(width/2-width*xcenter/xlength + (width/xlength)*datas[i][0]), Math.round(height/2 + (height/ylength)*datas[i][1]))] = p.color(Math.round(254*datas[i][2]/nlimit), 0, 0);
		}
	}
	
	$("#graph2").append('<img src="data:image/png;base64,'+p.getBase64()+'">');
}

$( document ).ready(function() {
	console.log( "ready!" );
	update(4,4,-0.5,0);
	$( "#update" ).click(function() {
		//console.log( "update!" );
		$("#graph2").empty();
		var zoom = parseFloat($( "#zoom" ).val().replace(',', '.'));
		var xlength = 4/zoom;
		var ylength = 4/zoom;
		var xcenter = parseFloat($( "#xcenter" ).val().replace(',', '.'));
		var ycenter = parseFloat($( "#ycenter" ).val().replace(',', '.'));
		update(xlength,ylength,xcenter,ycenter);
	});
	
	
});