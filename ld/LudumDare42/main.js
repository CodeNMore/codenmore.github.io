// Global variables
var app;
var width = 640, height = 360, halfWidth = width / 2, halfHeight = height / 2;
var tearX = 520, dirLimit = 230, spawnDir = -1;
var stars, tears;
var resources = null;
var moveDir = 0;
var resetting = false;
var runStartTime = Date.now();
var txtTime;

var screen = 0;
var player, spawner;
var asteroids = [];
var mnuText, insText, playing = false;

function tick(delta){
    // The starfield background
    stars.tick(delta);
    tears.tick(delta);
    
    if(playing){
        // Entities
        player.tick(delta);
        
        // Spawner
        spawner.tick(delta);
        
        // Asteroids
        for(var i = 0;i < asteroids.length;i++){
            asteroids[i].tick(delta);
        }
        
        // Add text on top
        txtTime.text = "Time Elapsed: " + ((Date.now() - runStartTime) / 1000) + " seconds";
        app.stage.removeChild(txtTime);
        app.stage.addChild(txtTime);
    }
}

function startGame(){
    // Not loading
    document.getElementById("divGame").innerHTML = "";
    // Create display
    app = new PIXI.Application({width: width, height: height, backgroundColor: 0x000000});
    document.getElementById("divGame").appendChild(app.view);
    
    // The starfield
    stars = new StarField(250);
    tears = new Tear(tearX);
    
    // Entities
    player = new Player();
    
    // Spawner
    spawner = new Spawner();
    
    // Timer
    txtTime = new PIXI.Text("Time Elapsed: 0 seconds", new PIXI.TextStyle({
        fill: "#00FF00",
        fontSize: 14,
        dropShadow: true,
        dropShadowColor: "#0000FF",
        dropShadowDistance: 3,
    }));
    txtTime.x = 5;
    txtTime.y = height - 20;
    app.stage.addChild(txtTime);
    
    // Menu
    mnuText = new PIXI.Text("Press [space] to begin!", new PIXI.TextStyle({
        fill: ["#00FF00", "#FF0000"],
        fontSize: 40
    }));
    mnuText.x = 80;
    mnuText.y = height / 2 - 20;
    app.stage.addChild(mnuText);
    
    insText = new PIXI.Text("Use W/S OR the Arrow Keys to avoid asteroids and run out of the space continuum completely in record time!", new PIXI.TextStyle({
        fill: "#FFFFFF",
        fontSize: 18,
        dropShadow: true,
        dropShadowColor: "#0000FF",
        dropShadowDistance: 2,
        wordWrap: true,
        wordWrapWidth: 350
    }));
    insText.x = 135;
    insText.y = height / 2 + 30;
    app.stage.addChild(insText);
    
    // Game loop
    app.ticker.add(tick);
}

function doneLoading(loader, res){
    resources = res;
    startGame();
}

function init(){
    document.getElementById("divGame").innerHTML = "<h2>Loading...</h2>";
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    PIXI.loader.add("player1", "player1.png")
                .add("player2", "player2.png")
                .add("asteroid", "asteroid.png")
                .load(doneLoading);
}

function keyDownHandler(e){
    if(e.keyCode == 40 || e.keyCode == 83){
        // Down
        moveDir = 1;
    }else if(e.keyCode == 38 || e.keyCode == 87){
        // Up
        moveDir = -1;
    }
}

function keyUpHandler(e){
    if(e.keyCode == 40 || e.keyCode == 83){
        // Down
        moveDir = 0;
    }else if(e.keyCode == 38 || e.keyCode == 87){
        // Up
        moveDir = 0;
    }else if(e.keyCode == 32 && !playing){
        playing = true;
        runStartTime = Date.now();
        app.stage.removeChild(mnuText);
        app.stage.removeChild(insText);
    }
}

function makeAnimatedSprite(speed, imageNames){
    var frames = [];
    for(var i = 0;i < imageNames.length;i++){
        frames.push(new PIXI.Texture(resources[imageNames[i]].texture));
    }
    var ret = new PIXI.extras.AnimatedSprite(frames);
    ret.animationSpeed = speed;
    ret.loop = true;
    ret.play();
    return ret;
}