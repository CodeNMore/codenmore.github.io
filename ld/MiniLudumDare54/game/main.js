var cam,
	renderer,
	state;

var width,
	height,
	allStates;

function startGame(){
	//RENDERING
	var canvas = document.getElementById("gameCanvas");
	width = canvas.width;
	height = canvas.height;
	
	cam = new THREE.PerspectiveCamera(45, width / height, 0.1, 32);
	
	renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: false, blending: false, antialias: false});
	document.getElementById("gameContainer").appendChild(renderer.domElement);
	//OTHER INITS
	state = new MainState();
	
	keyboard.addKeyListener();
	
	//BEGIN RENDER
	run();
}

function tick(){
	state.tick();
}

function render(){
	renderer.render(state.scene, cam);
}

function run(){
	tick();
	render();
	
	requestAnimationFrame(run);
}

var keyboard = {
	keys: {},
	
	up: 38,
	w: 87,
	m: 77,
	esc: 27,
	
	keydown: function(e){
		this.keys[e.keyCode] = true;
	},
	
	keyup: function(e){
		delete this.keys[e.keyCode];
	},
	
	isPressed: function(code){
		return this.keys[code];
	},
	
	addKeyListener: function(){
		window.addEventListener("keyup", function(e){keyboard.keyup(e);});
		window.addEventListener("keydown", function(e){keyboard.keydown(e);});
	},
	
	resetAllKeys: function(){
		this.keys = {};
	}
};