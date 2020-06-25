// var sidx = -1;
var sidx = -1;
var volumeLevel = 0.4;
var current = null;
var cm = null;
var waitAction = null;
var gameObj = null;
var scene = null;
var flags = [];

var scenes = {
	"shootingStar": {
		inited: false,
		sh: null,
		init: function(){
			this.inited = true;
			this.sh = game.add.sprite(width + 3, height / 4, "shuttle");
		},
		update: function(dt){
			if(!this.inited)
				this.init();
			this.sh.x -= 153 * dt;
			this.sh.y += 8 * dt;
		},
		reset: function(dt){
			this.sh = null;
			this.inited = false;
		}
	},
	"ending": {
		goats: [],
		timer: 0,
		mtime: 2,
		times: 0,
		blown: false,
		blowupPlanet: function(){
			this.blown = true;
			this.genGoats();
		},
		update: function(dt){
			if(!this.blown)
				return;

			this.timer += dt;
			if(this.timer > this.mtime && this.times < 3){
				this.genGoats();
				this.timer = 0;
			}

			if(this.timer > this.mtime * 2 && this.times >= 3){
				loseReason = "win";
				game.state.start("lose");
			}

			for(var i = this.goats.length - 1;i >= 0;--i){
				var g = this.goats[i];
				g.sprite.x += g.vx * dt;
				g.sprite.y += g.vy * dt;
			}
		},
		genGoats: function(){
			this.times++;
			var c = game.make.audio("goat", volumeLevel);
			game.add.audio(c);
			c.play();
			for(var i = 0;i < 1000;++i){
				this.goats.push({
					sprite: game.add.sprite(width / 2, height / 2, "goat"),
					vx: randomInt(-150, 150),
					vy: randomInt(-100, 100)
				});
			}
		},
		reset: function(){
			this.goats = [];
			this.timer = 0;
			this.times = 0;
			this.blown = false;
		}
	},
	"shuttleScene": {
		inited: false,
		sh: null,
		remaining: 1,
		sr: null,
		vx: 5,
		vy: 2,
		mnr: false,
		ray: {x: 0, y: 0},
		init: function(){
			this.inited = true;
			this.sh = game.add.sprite(width / 2, height / 2, "shuttle");
			this.sh.width = 4;
			this.sh.height = 4;

			this.sr = game.add.text(4, height - 20, "Shots Remaining: " + this.remaining, {font: "14px Arial", fill: "#FFFFFF", align: "left"});
		},
		update: function(dt){
			if(!this.inited)
				this.init();
			this.sh.x += this.vx * dt;
			this.sh.y += this.vy * dt;

			if(hasFlag("shuttleAttackable") && this.remaining > 0){
				// Check if user is trying to attack ship
				if(game.input.mousePointer.isDown && !this.mnr){
					this.mnr = true;

					// Fire a blast ray thingy majig
					this.ray.x = game.input.x + 16;
					this.ray.y = game.input.y + 16;
					this.remaining -= 1;
					this.sr.setText("Shots Remaining: " + this.remaining);
					var c = game.make.audio("blaster", volumeLevel);
					game.add.audio(c);
					c.play();

					var bounds = new Phaser.Rectangle(this.sh.x - 10, this.sh.y - 10, 20, 20);
					if(Phaser.Rectangle.containsPoint(bounds, this.ray)){
						// Hit
						waitAction.complete = true;
						this.sr.destroy();
					}else{
						// No hit
						loseReason = "shuttleMiss";
						game.state.start("lose");
					}

				}else if(!game.input.mousePointer.isDown && this.mnr){
					this.mnr = false;
				}
			}
		},
		reset: function(){
			this.inited = false;
			this.sh = null;
			this.sr = null;
			this.remaining = 1;
			this.mnr = false;
			this.ray = {x: 0, y: 0};
		},
		onBlowup: function(){
			this.sh.destroy();
			this.sr.destroy();
			var c = game.make.audio("explosion", volumeLevel);
			game.add.audio(c);
			c.play();
		}
	},
	"flares": {
		inited: false,
		cloud: null,
		flares: [],
		remaining: 20,
		toGen: 20,
		sr: null,
		speedInterval: {x: 120, y: 160},
		timeInterval: {x: 1.8, y: 2.2},
		timer: 0,
		wtime: -1,
		init: function(){
			this.inited = true;
			this.cloud = game.add.sprite(width / 2, height / 2, "cloud1");
			this.cloud.anchor.set(0.5, 2);

			this.sr = game.add.text(4, height - 20, "Flares Remaining: " + this.remaining, {font: "14px Arial", fill: "#FFFFFF", align: "left"});
		},
		update: function(dt){
			if(!this.inited)
				this.init();

			if(hasFlag("startFlares")){
				
				this.timer += dt;
				if(this.wtime == -1)
					this.wtime = randomInt(this.timeInterval.x, this.timeInterval.y);

				if(this.timer >= this.wtime){
					this.wtime = -1;
					this.timer = 0;
					this.makeCloud();
				}

				var pos = {x: game.input.x, y: game.input.y};
				var angle = Math.atan2(pos.y - (height / 2), pos.x - (width / 2));

				this.cloud.angle = angle * 180 / Math.PI + 90;

				var planetRect = new Phaser.Rectangle(width / 2 - 64, height / 2 - 64, 128, 128);
				var screenBounds = new Phaser.Rectangle(-32, -32, width + 64, height + 64);

				// Update flares
				for(var i = this.flares.length - 1;i >= 0;--i){
					var f = this.flares[i];
					f.sprite.x += f.vx * dt;
					f.sprite.y += f.vy * dt;

					if(f.def){
						if(!Phaser.Rectangle.containsPoint(screenBounds, {x: f.sprite.x, y: f.sprite.y})){
							f.sprite.destroy();
							this.flares.splice(i, 1);
						}
					}

					if(!f.def && Phaser.Rectangle.containsPoint(this.cloud.getBounds(), {x: f.sprite.x, y: f.sprite.y})){
						f.vx *= -1;
						f.vy *= -1;
						f.def = true;
						this.remaining--;
						var c = game.make.audio("defend", volumeLevel);
						game.add.audio(c);
						c.play();
					}else if(!f.def && Phaser.Rectangle.containsPoint(planetRect, {x: f.sprite.x, y: f.sprite.y})){
						loseReason = "flareMiss";
						var c = game.make.audio("explosion", volumeLevel);
						game.add.audio(c);
						c.play();
						game.state.start("lose");
					}
				}

				if(this.remaining <= 0){
					for(var i = 0;i < this.flares.length;++i)
						this.flares[i].sprite.destroy();
					this.cloud.destroy();
					this.sr.destroy();
					waitAction.complete = true;
				}

				this.sr.setText("Flares Remaining: " + this.remaining);
			}
		},
		makeCloud: function(){
			if(this.toGen <= 0)
				return;
			if(this.toGen <= 15){
				this.timeInterval = {x: 1.65, y: 1.9};
			}else if(this.toGen <= 9){
				this.speedInterval = {x: 140, y: 170};
			}

			this.toGen--;

			var x = 0;
			var y = 0;

			if(Math.random() >= 0.5){
				// Randomize X
				x = randomInt(0, width-20);
				if(Math.random() >= 0.5){
					y = -20;
				}else{
					y = height + 20;
				}
			}else{
				// Randomize Y
				y = randomInt(0, height-20);
				if(Math.random() >= 0.5){
					x = -20;
				}else{
					x = width + 20;
				}
			}

			var ang = Math.atan2(y - (height / 2), x - (width / 2));
			var vel = randomInt(this.speedInterval.x, this.speedInterval.y);

			var ret = {
				sprite: game.add.sprite(x, y, "flare"),
				vx: -vel * Math.cos(ang),
				vy: -vel * Math.sin(ang),
				def: false
			};
			ret.sprite.anchor.set(0.5);
			this.flares.push(ret);
		},
		reset: function(){
			this.inited = false;
			this.cloud = null;
			this.flares = [];
			this.remaining = 20;
			this.toGen = 20;
			this.sr = null;
			this.speedInterval = {x: 120, y: 160};
			this.timeInterval = {x: 1.8, y: 2.2};
			this.timer = 0;
			this.wtime = -1;
		}
	},
	"debris": {
		inited: false,
		mnr: false,
		remaining: 5,
		hits: 0,
		sr: null,
		ray: {x: 0, y: 0},
		startPos: {x: 50, y: 50},
		stallBounds: null,
		debris: [],
		init: function(){
			this.inited = true;
			this.sr = game.add.text(4, height - 20, "", {font: "14px Arial", fill: "#FFFFFF", align: "left"});

			this.startPos.x = scenes["shuttleScene"].sh.x;
			this.startPos.y = scenes["shuttleScene"].sh.y;

			this.stallBounds = new Phaser.Rectangle(this.startPos.x - 20, this.startPos.y - 20, 40, 40);

			for(var i = 0;i < this.remaining;++i){
				var d = {
					sprite: game.add.sprite(this.startPos.x, this.startPos.y, "shuttle"),
					vx: randomInt(-5, 5),
					vy: randomInt(-5, 5)
				};
				d.sprite.width = 3;
				d.sprite.height = 3;
				d.sprite.anchor.set(0.5);
				this.debris.push(d);
			}
		},
		update: function(dt){
			if(!this.inited)
				this.init();

			if(hasFlag("startDebrisCleaning") && this.remaining > 0){
				// Check if user is trying to attack ship
				if(game.input.mousePointer.isDown && !this.mnr){
					this.mnr = true;
					// Fire a blast ray thingy majig
					this.ray.x = game.input.x + 16;
					this.ray.y = game.input.y + 16;
					this.remaining -= 1;
					var c = game.make.audio("blaster", volumeLevel);
					game.add.audio(c);
					c.play();
					
					for(var i = 0;i < this.debris.length;++i){
						var d = this.debris[i];
						// Already hit, invisible
						if(!d.sprite.visible)
							continue;

						var bounds = new Phaser.Rectangle(d.sprite.x - 10, d.sprite.y - 10, 20, 20);
						if(Phaser.Rectangle.containsPoint(bounds, this.ray)){
							// Hit
							d.sprite.visible = false;
							this.hits++;
							break;
						}else if(i == this.debris.length - 1){
							// No hit
							loseReason = "debrisMiss";
							game.state.start("lose");
							break;
						}
					}

					if(this.hits >= 5){
						waitAction.complete = true;
						this.sr.destroy();
					}

				}else if(!game.input.mousePointer.isDown && this.mnr){
					this.mnr = false;
				}

				// Update debris
				for(var i = 0;i < this.remaining;++i){
					var d = this.debris[i];
					if(!d.sprite.visible)
						continue;
					d.sprite.x += d.vx * 3.5 * dt;
					d.sprite.y += d.vy * 3.5 * dt;
				}

				this.sr.setText("Shots Remaining: " + this.remaining);
				
			}else{
				// Hasn't started the actual game part yet, contain pieces
				for(var i = 0;i < this.remaining;++i){
					var d = this.debris[i];
					d.sprite.x += d.vx * dt;
					d.sprite.y += d.vy * dt;

					var x = d.sprite.x;
					var y = d.sprite.y;

					if(x < this.stallBounds.x || x > this.stallBounds.x + this.stallBounds.width)
						d.vx *= -1;
					if(y < this.stallBounds.y || y > this.stallBounds.y + this.stallBounds.height)
						d.vy *= -1;
				}
			}
		},
		reset: function(){
			this.inited = false;
			this.sr = null;
			this.mnr = false;
			this.remaining = 5;
			this.hits = 0;
			this.ray = {x: 0, y: 0};
			this.startPos = {x: 50, y: 50};
			this.stallBounds = null;
			this.debris = [];
		}
	}
};

var script = [
	{
		speaker: "Narrator",
		audio: "intro",
		text: "Isn't she beautiful? Just look at her, spinning round and round and round and round like that. Just wow. Wow!"
	},
	{
		speaker: "Narrator",
		audio: "intro2",
		text: "Anyways, welcome to this wonderful view from above. I have a feeling you will be very surprised at some of the events we will see that occur on this planet, even from this far above!"
	},

	{
		speaker: "Narrator",
		audio: "shuttle1",
		text: "Oh, oh, oh! Look at that! I think a space shuttle just launched off of the planet! Are you seeing this!?!",
		scene: "shuttleScene",
		action: {
			type: "delay",
			value: 9,
			counter: 0
		}
	},
	{
		speaker: "Narrator",
		audio: "shuttle2",
		text: "Alright, I know what you must do. Take this super-photon-blast-rig-of-life and, with your mouse, go ahead and blast that space shuttle! Trust me, it's the right thing to do.",
		scene: "shuttleScene",
		flags: ["shuttleAttackable"],
		action: {
			type: "blastShuttle",
			inited: false,
			complete: false
		}
	},
	{
		speaker: "Narrator",
		audio: "shuttle3",
		text: "Did it hit? I, I, I, I'm not quite sure...",
		scene: "shuttleScene",
		action: {
			type: "delay",
			value: 6,
			counter: 0
		}
	},
	{
		speaker: "Narrator (talking to someone in background)",
		audio: "shuttle4",
		text: "Hey, hey you, buddy in front of the console! Did you program this part into the game? Because that shuttle is not blowing up, and I'm pretty sure-",
		scene: "shuttleScene",
		action: {
			type: "delaySceneFunction",
			value: 7.7,
			counter: 0,
			func: "onBlowup"
		}
	},
	{
		speaker: "Narrator",
		audio: "shuttle5",
		text: "Ah! There it goes! I forgot, space is pretty large, even the super-photon-blast-rig-of-death takes time to travel through space, hah!",
		scene: "debris"
	},

	{
		speaker: "Narrator",
		audio: "a1",
		text: "To be honest, I'm quite shocked that you really thought that the super-photon-blast-rig-of-death was the super-photon-blast-rig-of-life. I mean, seriously, what super-photon-blast-rig wouldn't blast something into little pieces!?!",
		scene: "debris"
	},
	{
		speaker: "Narrator",
		audio: "a2",
		text: "Oh, that reminds me...we might want to pick up all of that debris that the explosion caused before it goes deep into space.",
		scene: "debris"
	},

	{
		speaker: "Narrator",
		audio: "pieces1",
		text: "Since cleaning up is boring, how about you just use the super-photon-blast-rig-of-death to blast the debris into smaller pieces? Go ahead, do it!",
		flags: ["startDebrisCleaning"],
		scene: "debris",
		action: {
			type: "debrisCleaning",
			inited: false,
			complete: false
		}
	},
	{
		speaker: "Narrator",
		audio: "pieces2",
		text: "Wow...you...you did better than I thought you would."
	},

	{
		speaker: "Narrator (talking to someone in background)",
		audio: "b1",
		text: "I thought you said they would lose by this point...what the hell? I don't know what else to do now, this is supposed to be an amazing game, but it sucks. Get programming buddy, quick!",
		action: {
			type: "delay",
			value: 11,
			counter: 0
		}
	},
	{
		speaker: "Narrator",
		audio: "b2",
		text: "Sorry about this, truly. There has been a couple of technical difficulties with the programmers of this project, so, uh, they are just fixing a few tiny little completely unobtrusive bugs up at the moment."
	},
	{
		speaker: "Narator",
		audio: "b3",
		text: "So, just give me like, honestly, 5 seconds please, just 5 seconds seriously, seriously, seriously, seriously please.",
		scene: "shootingStar",
		action: {
			type: "delay",
			value: 10,
			counter: 0
		}
	},
	{
		speaker: "Narrator (talking to someone in background)",
		audio: "b4",
		text: "That's the best you could come up with? Ok, just shut up, I'll tell the player.",
		action: {
			type: "delay",
			value: 5,
			counter: 0
		}
	},
	{
		speaker: "Narrator",
		audio: "b5",
		text: "Ah, yes! Everything was going so peaceful, until the sun started to spew off super-crazy-radiation flares towards the planet!"
	},

	{
		speaker: "Narrator",
		audio: "flare1",
		text: "You must guide the big, cute, fluffy cloud around the planet to block all of the super-crazy-radiation flares, before they destroy everything on the planet!"
	},
	{
		speaker: "Narrator",
		audio: "flare2",
		text: "Move the mouse to guide the cloud around the planet to defend it!",
		flags: ["startFlares"],
		scene: "flares",
		action: {
			type: "defendFlares",
			inited: false,
			complete: false
		}
	},
	{
		speaker: "Narrator",
		audio: "flare3",
		text: "To be honest, I was really hoping that one of those flares would get through and destroy the planet! But, unfortunately you're too good at that simple little game."
	},

	{
		speaker: "Narrator (talking to someone in background)",
		audio: "c1",
		text: "Do you have the next minigame ready, bud?",
		action: {
			type: "delay",
			value: 3,
			counter: 0
		}
	},
	{
		speaker: "Narrator (talking to someone in background)",
		audio: "c2",
		text: "What do you mean you fell asleep? That stupid game was to give you time to work on a better one! At least get a kick-ass ending ready, pretty please with sugar on top?",
		action: {
			type: "delay",
			value: 12,
			counter: 0
		}
	},
	{
		speaker: "Narrator",
		audio: "c3",
		text: "Ahem, and so with all of the major crisisisisis avoided, the planet was saved!"
	},
	{
		speaker: "Narrator",
		audio: "c4",
		text: "Until...",
		scene: "ending",
		action: {
			type: "delaySceneFunction",
			value: 3,
			counter: 0,
			func: "blowupPlanet"
		}
	}
];

function nextScript(){
	current = script[++sidx];
	return true;
}

function updateScripter(dt){
	if(scene != null)
		scenes[scene].update(dt);

	if(waitAction == null)
		return;

	switch(waitAction.type){
		case "delay":
			waitAction.counter += dt;
			if(waitAction.counter >= waitAction.value){
				// Action complete
				waitAction = null;
				readScript();
			}
			break;
		case "delaySceneFunction":
			waitAction.counter += dt;
			if(waitAction.counter >= waitAction.value){
				// Action complete
				scenes[scene][waitAction.func]();
				waitAction = null;
				readScript();
			}
			break;
		case "debrisCleaning":
			// Initialize task if needed
			if(!waitAction.inited){
				waitAction.inited = true;
				// Change cursor to blaster
				$("body").css("cursor", "url(assets/blaster.png), auto");
			}
			if(waitAction.complete){
				// Action complete
				waitAction = null;
				$("body").css("cursor", "auto");
				readScript();
			}
			break;
		case "defendFlares":
			// Initialize task if needed
			if(!waitAction.inited){
				waitAction.inited = true;
			}
			if(waitAction.complete){
				// Action complete
				waitAction = null;
				$("body").css("cursor", "auto");// not needed, but eh lets keep it
				readScript();
			}
			break;
		case "blastShuttle":
			// Initialize task if needed
			if(!waitAction.inited){
				waitAction.inited = true;
				// Change cursor to blaster
				$("body").css("cursor", "url(assets/blaster.png), auto");
			}
			if(waitAction.complete){
				// Action complete
				waitAction = null;
				$("body").css("cursor", "auto");
				readScript();
			}
			break;
		default:
			console.log("Unknown action, setting to null");
			waitAction = null;
			break;
	}
}

function readScript(g){
	if(g != null && g != undefined)
		gameObj = g;
	// make sure previous script is closed off

	if(waitAction != null)
		return;

	if(sidx != -1){
		if(cm != null)
			cm.stop();
		gameObj.setDialog("");
	}

	// perform next script action

	if(!nextScript())
		return;

	if(current == null)
		return;

	var hasAction = false;
	if("action" in current){
		hasAction = true;
		waitAction = current.action;
	}

	if("flags" in current){
		flags = flags.concat(current.flags);
	}

	var hasScene = false;
	if("scene" in current){
		hasScene = true;
		scene = current.scene;
	}else{
		scene = null;
	}

	var post = "";
	if(hasAction == false)
		post = "\n[Press Space to Continue]";

	gameObj.setDialog(current.speaker + "\n" + current.text + post);

	cm = game.make.audio(current.audio);
	game.add.audio(cm);
	cm.play();
}

function hasFlag(fn){
	return ($.inArray(fn, flags) == -1) ? false : true;
}