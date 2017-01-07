//Math.floor(((e.pageX-offx)/maze.wall.width))
var Node = function (name,width) {

	this.name = name;
	this.isVisited = false;
	this.neighbors = [];

	this.prop = {
			color : 'cyan',
			x : this.name.split('-')[1]*width,
			y : this.name.split('-')[0]*width,
			w : width
	};
	this.append = function (node) {
		this.neighbors.push(node);
	}

	this.getX = function () {
		return this.name.split('-')[1];
	}
	this.getY = function () {
		return this.name.split('-')[0];
	}
	this.print = function () {
		var s = name+":";
		for(var i = 0 ; i<this.neighbors.length;i++){
			s+= i!= this.neighbors.length - 1 ? this.neighbors[i].name+" -> ": this.neighbors[i].name;
		}

		console.log(s)
		return s;
	}
	this.draw = function (c) {
		c.fillStyle = this.prop.color
		c.fillRect(this.prop.x,this.prop.y,this.prop.w,this.prop.w);
	}
}

var Graph = function (x,NodeWidth) {
	
	
	this.nodes = [];
	this.x = x;
    this.target = null;

	this.appendNode = function (node) {
		this.nodes.push(node);
	};
	
	this.create = function () {
		for (var i = 0; i < this.x; i++) {
			this.nodes[i] = [];
			for(var j = 0;j<this.x;j++){
				var node = new Node(i+"-"+j,NodeWidth);
				this.nodes[i][j] = node;
			}
		};	
	}
    
    this.bfs = function(s){
    	var level = {s:0};
    	var parent = {};
    	parent[s.name] = null;
    	var k = 1;
    	var frontier = [s];
    	var valid = true;
    	while(frontier.length >0 && valid){
    		var next = [];
    		for(i in frontier){
    			u = frontier[i]
    			for(j in u.neighbors){
    				v = u.neighbors[j]
    				if(!(v in level)){
    					level[v.name] = k;
    					parent[v.name] = u.name;
    					next.push(v);
    				}
    			}
    		}
    		k++;
    		frontier = next
    	}
    	
    	var path=[];
    	var t = this.target.name;
    	while(t != null){
    		path.push(t);
    		t = parent[t];
    	}
    	return path.reverse();
    }

    this.explore = function (s,t) {
    	var level = [s];

    	var parent = {};
    	parent[s.name] = null;
    	
    	var i,j;
    	for(i = 0 ; i<level.length;i++){
    		//(p,c) stands for (parent,child)
    		p = level[i];
    		for(j = 0; j<p.neighbors.length;j++){
    			c = p.neighbors[j];
    			if(!isIn(c,level)){
    				level.push(c);
    				parent[c.name] = p.name;
    			}
    		}
    	}
    	var path=[];
    	var tmp = t.name;
    	while(tmp != null){
    		path.push(tmp);
    		tmp = parent[tmp];
    	}
    	return path.reverse();

    }
    var isIn = function (n,stack) {
    	for(i = 0;i<stack.length;i++){
    		if(stack[i] == n){
    			return true;
    		}
    	}

    	return false
    }
	this.print = function () {
			for(var i = 0;i<this.x;i++){
				for(var j = 0;j<this.x;j++){
					this.nodes[i][j].print();
				}
			}
	};
}

var Maze  = function (w,x) {

	this.wall={width:w/x,thick : 2,color:'black'};
	this.edge_left = [];
	this.edge_top = [];
	this.NOTHING = 0;
	this.WALL = 1;
	this.nx = x;
	this.ny =x;
	this.graph = null;
	this.isSolved = false;
	this.currentNode = null;
	this.sourceSet = false;
	this.targetSet = false;
	this.source = null;
	this.target = null;
	this.path = [];

	this.create = function () {
		
		for(i = 0;i<=this.nx;i++){
			this.edge_top[i] = [];
			this.edge_left[i] = [];
			for(j = 0;j<=this.ny;j++){
				this.edge_top[i][j] = 0;
				this.edge_left[i][j] = 0;
			}
		}
		this.graph = new Graph(this.nx,this.wall.width);
		this.graph.create();
		this.randomize();
	}

	this.randomize = function () {
		// Grow a maze via randomized DFS:
		var parent = {};
  		var frontier = [[null, [0,0]]];

  		while (frontier.length > 0) {
  		  // Extract random edge (parent, child)
  		  var i = Math.floor (Math.random () * frontier.length);
  		  var p = frontier[i][0];
  		  var c = frontier[i][1];
  		  if (frontier.length == 1)
  		    frontier.pop ();
  		  else
  		    frontier[i] = frontier.pop ();
  		  if (parent[c] == undefined) {
  		    parent[c] = p;
  		    if (c[0] > 0)
  		      frontier.push ([c, [c[0]-1, c[1]]]);
  		    if (c[1] > 0)
  		      frontier.push ([c, [c[0], c[1]-1]]);
  		    if (c[0] < this.nx-1)
  		      frontier.push ([c, [c[0]+1, c[1]]]);
  		    if (c[1] < this.ny-1)
  		      frontier.push ([c, [c[0], c[1]+1]]);
  		  }
  		}
		// Convert to edge representation.
		for (var y = 0; y < this.ny; y++) {
		  this.edge_left[0][y] = this.WALL;
		  for (var x = 1; x < this.nx; x++) {
		    this.edge_left[x][y] =
		      (parent[[x,y]][0] == x-1 && parent[[x,y]][1] == y) ||
		      (parent[[x-1,y]][0] == x && parent[[x-1,y]][1] == y) ? this.NOTHING : this.WALL;
		  }
		  this.edge_left[this.nx][y] = this.WALL;
		}
		for (var x = 0; x < this.nx; x++) {
		  this.edge_top[x][0] = this.WALL;
		  for (var y = 1; y < this.ny; y++) {
		    this.edge_top[x][y] =
		      (parent[[x,y]][0] == x && parent[[x,y]][1] == y-1) ||
		      (parent[[x,y-1]][0] == x && parent[[x,y-1]][1] == y) ? this.NOTHING : this.WALL;
		  }
		  this.edge_top[x][this.ny] = this.WALL;
		}

		this.isSolved = false;
		this.sourceSet = this.targetSet = false;
		this.path = [];
		this.source = this.target = null
		$('#time').text("Search Time ")
		$('#start').text("Start Position ")
		$('#target').text("Target Position ")
		this.setGraph();
	}

	this.setGraph = function () {
		this.graph.create();
			for(i = 0;i<this.nx;i++){
				for(j = 0;j<this.nx;j++){
					
					if(i>=1){
						if(this.edge_left[i][j] == 0){
		
							this.graph.nodes[j][i].append(this.graph.nodes[j][i-1]);
							this.graph.nodes[j][i-1].append(this.graph.nodes[j][i]);
						}
					}

					if(j >= 1 ){
						if(this.edge_top[i][j] == 0){
							this.graph.nodes[j][i].append(this.graph.nodes[j-1][i]);
							this.graph.nodes[j-1][i].append(this.graph.nodes[j][i]);
						}
					}
	
				}
			}
	}
	this.solve = function () {
		
		if(! this.isSolved && this.sourceSet && this.targetSet){
			this.path=[];
			var array;
			var now = new Date().getTime();
			array =  this.graph.explore(this.source,this.target);

			for(i in array){
				this.path.push(new Node(array[i],this.wall.width));
			}
			this.isSolved = true;
			var then = new Date().getTime()-now;
			//alert(then/1000)
			$('#time').text("Search Time "+then/1000+' (s)')
		}else{
			alert("set target and/or source or maze is already solved try to randomize");
		}
	}
	this.set =  function (i,j,b) {
		if(b){
			this.source = this.graph.nodes[j][i];
			this.currentNode = this.source;
			
			
			this.sourceSet = true;

		}else{
			this.target = this.graph.nodes[j][i];
			this.targetSet = true;
		}
	}
	this.draw = function (c) {
		if(this.source != null){
			this.source.prop.color='gray';
			this.source.draw(c);
		}
		if(this.target != null){
			this.target.prop.color = "gray";
			this.target.draw(c);
		}
		
		
		for(i in this.path){
			if(i == 0){
				this.path[i].prop.color = 'grey'
			}else if(i == this.path.length-1){
				this.path[i].prop.color = 'grey'
			}else{
				this.path[i].prop.color = 'cyan'
			}
			this.path[i].draw(c);
		}
		c.lineWidth = this.wall.thick;
		c.strokeStyle = this.wall.color;
		for(i = 0;i<this.nx;i++){
			for(j = 0;j<this.nx;j++){
				if(this.edge_left[i][j]){
					c.beginPath();
					c.moveTo(i*this.wall.width,j*this.wall.width);
					c.lineTo(i*this.wall.width,(j+1)*this.wall.width);
					c.stroke();
				}
				if(this.edge_top[i][j]){
					c.beginPath();
					c.moveTo(i*this.wall.width,j*this.wall.width);
					c.lineTo((i+1)*this.wall.width,(j)*this.wall.width);
					c.stroke();
				}
			}
		}
	}
	this.update = function (w) {
		this.wall.width = w/this.nx;
		//if(this.isSolved){
		//	this.solve(new Node(this.activeSet[0]));
		//}
	}

	this.goRight = function () {
		var c = this.currentNode;
		if(c.getX() != this.nx-1){
			var n = this.graph.nodes[c.getY()][(c.getX()-(-1))];
			var f = 0;
				for(i = 0;i<c.neighbors.length;i++){
					if(n.name === c.neighbors[i].name ){
						for(j = this.path.length-2;j>=0;j--){
							if(this.path[j].name === n.name){
								
								this.path.pop();
								this.currentNode = this.path[this.path.length-1];
								f = 1;
								break;
							}
						}
						if(f == 0){
								this.path.push(n);
								this.currentNode = n;
						}
						break;
					}
				}
		}
	}
	this.goLeft = function () {
		var c = this.currentNode;
		if(c.getX() != 0){
			var n = this.graph.nodes[c.getY()][(c.getX()-1)];
			var f = 0;
				for(i = 0;i<c.neighbors.length;i++){
					if(n.name === c.neighbors[i].name){
						for(j = this.path.length-2;j>=0;j--){
							if(this.path[j].name === n.name){
								this.path.pop();
								this.currentNode = this.path[this.path.length-1];
								f = 1;
								break;
							}
						}
						if(f == 0){
								this.path.push(n);
								this.currentNode = n;
						}
					}
					break;
				}
		}
	}
	this.goUp = function () {
		var c = this.currentNode;
		if(c.getY() != 0){
			var n = this.graph.nodes[c.getY()-1][c.getX()];
			var f = 0;
				for(i = 0;i<c.neighbors.length;i++){
					if(n.name === c.neighbors[i].name ){
						for(j = this.path.length-2;j>=0;j--){
							if(this.path[j].name === n.name){
								this.path.pop();
								this.currentNode = this.path[this.path.length-1];
								f = 1;
								break;
							}
						}
						if(f == 0){
								this.path.push(n);
								this.currentNode = n;
						}
						break;
					}
				}
		}
	}
	this.goDown = function () {
		var c = this.currentNode;

		if(c.getY() != this.nx-1){

			var n = this.graph.nodes[(c.getY()-(-1))][c.getX()];
			var f = 0;
				for(i = 0;i<c.neighbors.length;i++){
					if(n.name === c.neighbors[i].name ){
						for(j = this.path.length-2;j>=0;j--){
							if(this.path[j].name === n.name){
								this.path.pop();
								this.currentNode = this.path[this.path.length-1];
								f = 1;
								break;
							}
						}
						if(f == 0){
								this.path.push(n);
								this.currentNode = n;
						}
						break;
					}
				}
		}
	}
}

function randMaze () {
	maze.randomize()
}

function solveMaze() {
	maze.solve();
}