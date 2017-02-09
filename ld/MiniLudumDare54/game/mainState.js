var wPressed = false, upPressed = false;

function MainState(){
	this.scene = new THREE.Scene();
	this.menu = true;
	this.ready1 = false;
	this.ready2 = false;
	
	this.tick = function(){
		if(!this.menu){
			this.getInput();
		
			ship1.tick();
			ship2.tick();
		
			this.updateGameInfo();
				
			if(checkShips(ship1, ship2)){
				this.resetAll();
				this.menu = true;
			}
			
			updateParticleVelocity(particles, particlePoints, 10, particleWidth, particleHeight, particleDepth, minvel, maxvel);
			updateParticleVelocity(fire1, fire1Points, 2, fireWidth, fireHeight, fireDepth, fireMinVel, fireMaxVel);
			updateParticleVelocity(fire2, fire2Points, 2, fireWidth, fireHeight, fireDepth, fireMinVel, fireMaxVel);
		}else{
			this.ready1 = false;
			this.ready2 = false;
			
			if(keyboard.isPressed(keyboard.w))
			   this.ready1 = true;
			if(keyboard.isPressed(keyboard.up))
			   this.ready2 = true;
			
			this.setMenuInfo();
			
			if(this.ready1 && this.ready2)
				this.menu = false;
			
			updateParticleVelocity(particles, particlePoints, 16, particleWidth, particleHeight, particleDepth, minvel, maxvel);
			updateParticleVelocity(fire1, fire1Points, 3, fireWidth, fireHeight, fireDepth, fireMinVel, fireMaxVel);
			updateParticleVelocity(fire2, fire2Points, 3, fireWidth, fireHeight, fireDepth, fireMinVel, fireMaxVel);
		}
	};
	//ON CREATE STUFF
	var rs = 0.3, rotationThreshhold = 20;

	var ship1 = new Ship();
	ship1.ship.position.x = -2.0;
	this.scene.add(ship1.ship);
	
	var ship2 = new Ship();
	ship2.ship.position.x = 2.0;
	ship2.ship.material = new THREE.MeshPhongMaterial({color: 0x0000ff});
	this.scene.add(ship2.ship);
	
	var mainPoint = createPointLight(0xffffff, 1.0, 20);
	this.scene.add(mainPoint);
	
	var ambient = createAmbientLight(1, 1, 1, 0.1);
	this.scene.add(ambient);
	
	//Visual Effects
	var minvel = 0.15;
	var maxvel = 0.27;
	var particleWidth = 11;
	var particleHeight = 8;
	var particleDepth = 12;
	var particlePoints = createParticlePoints(1500, particleWidth, particleHeight, particleDepth, minvel, maxvel);
	var particles = createParticleSystem(particlePoints, new THREE.PointCloudMaterial({color: 0xffffff, size: 0.03}));
	particles.sortParticles = true;
	particles.position.z = -12;
	this.scene.add(particles);
	
	var fireWidth = 0.2;
	var fireHeight = 0.25;
	var fireDepth = 3;
	var fireMinVel = 0.04;
	var fireMaxVel = 0.1;
	var fire1Points = createParticlePoints(250, fireWidth, fireHeight, fireDepth, fireMinVel, fireMaxVel);
	var fire1 = createParticleSystem(fire1Points, new THREE.PointCloudMaterial({color: 0xff2222, size: 0.03}));
	fire1.sortParticles = true;
	fire1.position.z = ship1.currentZ;
	fire1.position.x = ship1.ship.position.x + fireWidth;
	fire1.position.y = ship1.ship.position.y - fireHeight;
	this.scene.add(fire1);
	
	var fire2Points = createParticlePoints(250, fireWidth, fireHeight, fireDepth, fireMinVel, fireMaxVel);
	var fire2 = createParticleSystem(fire2Points, new THREE.PointCloudMaterial({color: 0xff2222, size: 0.03}));
	fire2.sortParticles = true;
	fire2.position.z = ship2.currentZ;
	fire2.position.x = ship2.ship.position.x - fireWidth;
	fire2.position.y = ship2.ship.position.y - fireHeight;
	this.scene.add(fire2);
	
	//INPUT
	this.getInput = function(){
		if(wPressed && !keyboard.isPressed(keyboard.w))
			wPressed = false;
		
		if(!wPressed && keyboard.isPressed(keyboard.w)){//SHIP 1
			ship1.boost();
			wPressed = true;
		}
		
		if(upPressed && !keyboard.isPressed(keyboard.up))
			upPressed = false;
		
		if(!upPressed && keyboard.isPressed(keyboard.up)){//SHIP 2
			ship2.boost();
			upPressed = true;
		}
	};
	
	this.resetAll = function(){
		ship1.distance = 0.0;
		ship2.distance = 0.0;
		ship1.currentZ = ship1.startingZ;
		ship2.currentZ = ship2.startingZ;
		ship1.ship.position.z = ship1.startingZ;
		ship2.ship.position.z = ship2.startingZ;
		
		keyboard.resetAllKeys();
	};
	
	this.updateGameInfo = function(){
		var c = document.getElementById("gameInfoGreen");
		c.innerHTML = "<font size = '5'>GREEN: " + ship1.distance + " OF " + ship1.finishDistance + " completed.</font>";
		c = document.getElementById("gameInfoBlue");
		c.innerHTML = "<font size = '5'>BLUE: " + ship2.distance + " OF " + ship2.finishDistance + " completed.</font>";
	};
	
	this.setMenuInfo = function(){
		var c = document.getElementById("gameInfoGreen");
		
		if(!this.ready1)
			c.innerHTML = "<font size = '5'>GREEN Hold 'W' When Ready!</font>";
		else
			c.innerHTML = "<font size = '5'>GREEN IS READY!</font>";
			
		c = document.getElementById("gameInfoBlue");
		
		if(!this.ready2)
			c.innerHTML = "<font size = '5'>BLUE Hold 'UP' When Ready!</font>";
		else
			c.innerHTML = "<font size = '5'>BLUE IS READY!</font>";
	};
}

function checkShips(ship1, ship2){
	var temp;
	if(ship1.distance > ship2.distance){
		temp = ship1.startingZ - (ship1.distance - ship2.distance);
		if(temp > ship1.maxAhead)
			ship1.currentZ = temp;
	}
	if(ship2.distance > ship1.distance){
		temp = ship2.startingZ - (ship2.distance - ship1.distance);
		if(temp > ship2.maxAhead)
			ship2.currentZ = temp;
	}
	
	if(ship1.distance >= ship1.finishDistance || ship2.distance >= ship2.finishDistance){//CROSSED FINISH LINE!
		if(ship1.distance > ship2.distance){
			alert("Green Wins the Race!");
		}else if(ship2.distance > ship1.distance){
			alert("Blue Wins the Race!");
		}else if(ship1.distance == ship2.distance){
			alert("It's...it's a tie!");
		}
		return true;
	}
	return false;
}

function Ship(){
	var rs = toRadians(0.33), rotationThreshhold = toRadians(20);
	var boostSpeed = 0.25;
	this.startingZ = -5;
	this.currentZ = this.startingZ;
	this.smoothSpeed = 0.02;
	this.maxAhead = -10;
	this.distance = 0.0;
	this.finishDistance = 20.0;//FINISH LINE
	
	this.ship = createSphereMesh(1.0, 16, 16, new THREE.MeshPhongMaterial({color: 0x00ff00}));
	this.ship.position.z = this.startingZ;
	this.ship.scale.y = 0.25;
	this.ship.rotation.x = toRadians(16);
	
	this.tick = function(){
		this.distance += 0.001;
		//COOL SHIP EFFECTS
		this.ship.rotation.z += rs;
		if(this.ship.rotation.z > rotationThreshhold){
			rs = -rs;
		}else if(this.ship.rotation.z < -rotationThreshhold){
			rs = -rs;
		}
		
		//MOVE SHIP SMOOTHLY
		if(this.ship.position.z > this.currentZ){
			this.ship.position.z -= this.smoothSpeed;
		}else if(this.ship.position.z < this.currentZ){
			this.ship.position.z += this.smoothSpeed;
		}
	};
	
	this.boost = function(){
		this.distance += boostSpeed;
	};
}