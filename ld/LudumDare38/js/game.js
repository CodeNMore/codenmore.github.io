var worldSize = 128;

var gameState = {

	create: function(){
		this.world = new World(width / 2 - worldSize / 2, height / 2 - worldSize / 2);

		// Keys
		this.kSpace = game.input.keyboard.addKey(32);
		this.kSpaceNeedsRelease = false;

		// Text area
		this.dialog = game.add.text(width / 2, 4, "", {font: "14px Arial", fill: "#FFFFFF", align: "center", wordWrap: true, wordWrapWidth: width - 8});
		this.dialog.anchor.set(0.5, 0);

		// Start the script service
		readScript(this);
	},

	update: function(){
		var dt = game.time.elapsed / 1000;

		this.world.update(dt);
		updateScripter(dt);

		// Check if next dialog space bar
		if(this.kSpace.isDown && !this.kSpaceNeedsRelease){
			readScript(this); // Try to go to next script, if available
			this.kSpaceNeedsRelease = true;
		}else if(this.kSpaceNeedsRelease && !this.kSpace.isDown){
			this.kSpaceNeedsRelease = false;
		}
	},

	setDialog: function(text){
		this.dialog.setText(text);
	}

};

function World(x, y){
	this.x = x;
	this.y = y;
	// Generate world tinting
	// this.landTint = genNiceColor(0xffff33);
	// this.waterTint = genNiceColor(0xffffff, {r: 128, g: 128, b: 255});
	this.landTint = 0x00ff00;
	this.waterTint = 0x0000ff;
	
	// Create world sprites
	this.worldBg = game.add.sprite(this.x, this.y, "blankPlanet");
	this.worldBg.width = worldSize;
	this.worldBg.height = worldSize;
	this.worldBg.tint = this.waterTint;

	this.over1 = game.make.sprite(0, 0, "planetOverlay1");
	this.over1.tint = this.landTint;
	this.over2 = game.make.sprite(0, 0, "planetOverlay2");
	this.over2.tint = this.landTint;

	this.bmd = game.make.bitmapData(worldSize, worldSize);
	this.bmd.addToWorld(this.x, this.y);

	this.worldCover = game.add.sprite(this.x, this.y, "planetCover");
	this.worldCover.width = worldSize;
	this.worldCover.height = worldSize;

	this.scroll = 0;

	this.update = function(dt){
		this.scroll -= 20 * dt;

		this.bmd.clear();
		if(this.scroll < -worldSize * 2){
			this.scroll = 0;
			this.bmd.draw(this.over1, this.scroll, 0, worldSize, worldSize);
		}else if(this.scroll < -worldSize){
			this.bmd.draw(this.over1, this.scroll + worldSize * 2, 0, worldSize, worldSize);
		}else{
			this.bmd.draw(this.over1, this.scroll, 0, worldSize, worldSize);
		}

		this.bmd.draw(this.over2, this.scroll + worldSize, 0, worldSize, worldSize);
	};

}