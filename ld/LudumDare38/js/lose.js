var loseReason = "default";

var loseState = {

	create: function(){
		this.kR = game.input.keyboard.addKey(82);
		this.kRNeedsRelease = false;

		this.ltext = game.add.text(width / 2, height / 2 + 64, "na", {font: "20px Arial", fill: "#FFFFFF", align: "center", wordWrap: true, wordWrapWidth: width - 8});
		this.ltext.anchor.set(0.5);

		this.gt = game.add.text(width / 2, 64, "Loser!", {font: "82px Arial", fill: "#FFFFFF", align: "center"});
		this.gt.anchor.set(0.5, 0);
	},

	update: function(){
		$("body").css("cursor", "auto");

		this.gt.setText("Loser!");
		var txt = "";
		switch(loseReason){
			case "win":
				txt = "Ha! You just wasted a few minutes of your life for a stupid game and goats!";
				this.gt.setText("Winner!");
				break;
			case "shuttleMiss":
				txt = "Seriously? You lost because you couldn't aim your single shot correctly? Come on, the thing was moving at, like, really slow miles per hour. Try again.";
				break;
			case "debrisMiss":
				txt = "Seriously? You lost because you couldn't clean up the mess that YOU made? Come on, try again.";
				break;
			case "flareMiss":
				txt = "Woah, you were not the person for that job! Basically, you killed off 103,003 species of plants and nearly every living animal on that planet. Good going, try again.";
				break;
			case "default":
				txt = "Well, better luck next time buddy!";
				break;	
		}

		txt += "\n\n\n\n\n\n[Please Reload the Page to Play Again (pressing R may do this)]";

		this.ltext.setText(txt);

		// Check if restart
		if(this.kR.isDown && !this.kRNeedsRelease){
			resetAll();
			// game.state.start("home");

			window.location.reload(false);

			this.kRNeedsRelease = true;
		}else if(this.kRNeedsRelease && !this.kR.isDown){
			this.kRNeedsRelease = false;
		}
	}

};

function resetAll(){
	for(var p in scenes){
		if(scenes.hasOwnProperty(p)){
			var s = scenes[p];
			s.reset();
		}
	}

	sidx = -1;
	current = null;
	cm = null;
	waitAction = null;
	gameObj = null;
	scene = null;
	flags = [];
}