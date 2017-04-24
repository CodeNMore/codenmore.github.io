var homeState = {

	create: function(){
		this.bStart = game.add.button(width / 2 - 128, height / 2 - 48, "button", this.bStartClick, this, 2, 1, 0);

		this.title = game.add.text(width / 2, 64, "A View from Above", {font: "64px Arial", fill: "#ffffff", align: "center"});
		this.title.anchor.set(0.5, 0);

		var style = {font: "20px Arial", fill: "#ffffff", align: "center"};
		this.aText = game.add.text(width / 2, height / 2 + 128, "For the best experience, turn your audio on!", style);
		this.aText.anchor.set(0.5);
	},

	update: function(){
		var dt = game.time.elapsed / 1000;
	},

	bStartClick: function(){
		game.state.start("game");
	}

};