// Global variables
var game, width = 800, height = 500;

// Base functions

function preload(){
	game.stage.disableVisibilityChange = true;
	// Load images
	game.load.image("blankPlanet", "assets/blankPlanet.png");
	game.load.image("planetOverlay1", "assets/planetOverlay1.png");
	game.load.image("planetOverlay2", "assets/planetOverlay2.png");
	game.load.image("planetCover", "assets/planetCover.png");
	game.load.image("cloud1", "assets/cloud1.png");
	game.load.image("shuttle", "assets/shuttle.png");
	game.load.image("flare", "assets/flare.png");
	game.load.image("goat", "assets/goat.png");
	game.load.spritesheet("button", "assets/buttons.png", 256, 96);

	// Sounds
	lsnd("intro");
	lsnd("intro2");
	lsnd("shuttle1");
	lsnd("shuttle2");
	lsnd("shuttle3");
	lsnd("shuttle4");
	lsnd("shuttle5");
	lsnd("a1");
	lsnd("a2");
	lsnd("pieces1");
	lsnd("pieces2");
	lsnd("b1");
	lsnd("b2");
	lsnd("b3");
	lsnd("b4");
	lsnd("b5");
	lsnd("flare1");
	lsnd("flare2");
	lsnd("flare3");
	lsnd("c1");
	lsnd("c2");
	lsnd("c3");
	lsnd("c4");
	lsnd("blaster");
	lsnd("explosion");
	lsnd("defend");
	lsnd("goat");
}

function lsnd(name){
	game.load.audio(name, ["sound/" + name + ".ogg", "sound/" + name + ".mp3"]);
}

function create(){
	// We are done loading, so add the states
	game.state.add("home", homeState);
	game.state.add("game", gameState);
	game.state.add("lose", loseState);
	// Set the starting state
	game.state.start("home");

	// Remove loading screen, show actual game
	$("#loading").fadeOut(2500, function(){
		$("#gc").fadeIn(2500);// TODO: CHANGE TO 1300
	});
}

// Entry point
function start(){
	game = new Phaser.Game(800, 500, Phaser.AUTO, "gc", {preload: preload, create: create});
}