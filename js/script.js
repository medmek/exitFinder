

function draw () {
	var canvas = document.getElementById('canvas')
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.save()
	ctx.fillStyle = 'white'
	ctx.fillRect(0,0,500,500);
	if(maze != null){
		maze.draw(ctx);
	}
	setTimeout("draw()", 250);
}
	
var maze ;

$(document).ready(function () {
	$('.play').bind('click',function () {
		var exp = new RegExp("[0-9]+");
		var size = $('.mazeDim').val().trim();

		if($('.mazeDim').val().trim() != ""){
			if(exp.test($('.mazeDim').val())){
				if($('.mazeDim').val().trim() <=500){
					$('.dataHolder').hide();
					houseKeep(size);
					$('.mazeHolder').show();
				}else{
					alert('err dim')
				}
			}
		}
	});
	$('#canvas').bind('click',function (e) {
		var i = Math.floor(((e.pageX-this.offsetLeft)/maze.wall.width)),
			j = Math.floor(((e.pageY-this.offsetTop)/maze.wall.width));
		
			if(i >= maze.nx){
				i = maze.nx -1;
			}
			if(j >= maze.nx){
				j = maze.nx -1;
			}

		if(!maze.sourceSet){
			maze.set(i,j,true);
			$('#start').text("Start Position "+i+"-"+j);
		}else if(!maze.targeSet){
			maze.set(i,j,false);
			$('#target').text("Target Position "+i+"-"+j);
		}
		

	});
});

function houseKeep (x) {
	
	var canvasWidth = 500//Math.min($(document).width(),$(document).height())-60;

	var m = new Maze(canvasWidth,x);//x : number of blocks 
	m.create();
	maze = m;
	draw();//to draw Canvas
	$('#canvas').attr('height',canvasWidth).attr('width',canvasWidth);
}

function goLeft () {
	maze.goLeft();
}
function goUp () {
	maze.goUp();
}
function goRight () {

	maze.goRight();		
}
function goDown () {
	maze.goDown();
}