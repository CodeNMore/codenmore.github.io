function Player(){
    this.vy = 0;
    this.speedY = 2.5;
    this.accelY = 0.13;
    this.decelY = 0.022;
    this.travelVx = 0.3;
    this.vx = this.travelVx;
    this.startX = 15;
    
    this.init = function(){
        this.animation = makeAnimatedSprite(0.2, ["player1", "player2"]);
        this.animation.width = 48;
        this.animation.height = 48;
        this.animation.x = this.startX;
        this.animation.y = height / 2 - this.animation.height / 2;
        app.stage.addChild(this.animation);
        
        // The pipeline
        this.pipeline = new Pipeline(this.animation.x, this.animation.y);
    };
    
    this.tick = function(delta){
        // Handle accel
        if(moveDir < 0){
            this.vy -= this.accelY * delta;
            if(this.vy < -this.speedY) this.vy = -this.speedY;
        }else if(moveDir > 0){
            this.vy += this.accelY * delta;
            if(this.vy > this.speedY) this.vy = this.speedY;
        }else{
            if(this.vy < 0){
                this.vy += this.decelY * delta;
                if(this.vy > 0) this.vy = 0;
            }else if(this.vy > 0){
                this.vy -= this.decelY * delta;
                if(this.vy < 0) this.vy = 0;
            }
        }
        
        // Handle resetting
        if(resetting){
            this.vy = 0;
            this.vx = -1.5;
        }
        
        // Move
        this.animation.y += delta * this.vy;
        this.animation.x += delta * this.vx;
        
        // Check if done resetting
        if(resetting && this.animation.x <= this.startX){
            resetting = false;
            this.vx = this.travelVx;
        }
        
        // Check y limit
        if(this.animation.y < 0) this.animation.y = 0;
        if(this.animation.y + this.animation.height > height) this.animation.y = height - this.animation.height;
        
        // Update pipeline
        this.pipeline.x = this.animation.x + this.animation.width / 2;
        this.pipeline.y = this.animation.y + this.animation.height / 2;
        this.pipeline.tick(delta);
        
        // So we are on top...must be a better way?
        app.stage.removeChild(this.animation);
        app.stage.addChild(this.animation);
        
        // Check win condition
        var col = false;
        if(this.animation.x > tearX){
            col = true;
            resetting = true;
            document.getElementById("win").innerHTML = "You ran out of space in " + ((Date.now() - runStartTime) / 1000) + " seconds!";
            document.getElementById("win").style.display = "block";
            runStartTime = Date.now();
        }else if(this.animation.x > dirLimit){
            spawnDir = 1;
        }else{
            spawnDir = -1;
        }
        
        // Check for collisions with asteroids
        if(!col){
            var bounds = new PIXI.Rectangle(this.animation.x, this.animation.y, this.animation.width, this.animation.height);
            var toRem = [];
            for(var i = 0;i < asteroids.length;i++){
                var cb = asteroids[i].getBounds();
                if(overlaps(cb, bounds)){
                    col = true;
                    resetting = true;
                    break;
                }
            }
        }
        
        // If collision, we are resetting
        if(col){
            for(var i = 0;i < asteroids.length;i++){
                app.stage.removeChild(asteroids[i].texture);
            }
            asteroids = [];
        }
    };
    
    this.init();
}

function Spawner(){
    this.lastTime = Date.now();
    this.timer = 0;
    this.startInterval = 1650;
    this.interval = this.startInterval;
    
    this.init = function(){
        
    };
    
    this.tick = function(delta){
        this.timer += Date.now() - this.lastTime;
        this.lastTime = Date.now();
        
        if(this.timer > this.interval){
            this.timer = 0;
            
            asteroids.push(new Asteroid(((spawnDir > 0) ? -50 : width + 50 ), this.getY(), this.getVx(), this.getVy()));
        }
    };
    
    this.getY = function(){
        return getRandomFloat(50, height - 90);
    };
    
    this.getVx = function(){
        if(spawnDir > 0){
            this.interval = 1300;
            return getRandomFloat(4, 6.4);
        }else{
            return getRandomFloat(3, 5) * -1;
        }
    };
    
    this.getVy = function(){
        if(spawnDir > 0){
            return getRandomFloat(-1.2, 1.2);
        }else{
            return getRandomFloat(-0.35, 0.35);
        }
    };
    
    this.init();
}

function Asteroid(x, y, vx, vy){
    this.vx = vx;
    this.vy = vy;
    this.rs = 0.1;
    this.texture = null;
    
    this.init = function(x, y){
        this.texture = new PIXI.Sprite(resources.asteroid.texture);
        this.texture.anchor.set(0.5);
        this.texture.x = x;
        this.texture.y = y;
        this.texture.width = 40;
        this.texture.height = this.texture.width;
        this.rs = getRandomFloat(0, 0.09);
        app.stage.addChild(this.texture);
    };
    
    this.tick = function(delta){
        this.texture.rotation += delta * this.rs;
        this.texture.x += delta * this.vx;
        this.texture.y += delta * this.vy;
    };
    
    this.getBounds = function(){
        return new PIXI.Rectangle(this.texture.x - this.texture.width / 2, this.texture.y - this.texture.height / 2, 
                                this.texture.width, this.texture.height);
    };
    
    this.init(x, y);
}

function overlaps(a, b){
    return !(b.left > a.right ||
            b.right < a.left ||
            b.top > a.bottom ||
            b.bottom < a.top);
}

function Pipeline(x, y){
    this.x = x;
    this.y = y;
    this.numDiffs = 20;
    this.variance = 7;
    this.speed = 0.1;
    this.speedVar = 0.05;
    this.diffs = [];
    this.shape = null;
    
    this.init = function(){
        // Create initial tears
        for(var i = 0;i <= this.numDiffs;i++){
            this.diffs.push([0,
                            ((Math.random() >= 0.5) ? 1 : -1),
                            getRandomFloat(this.speed - this.speedVar, this.speed + this.speedVar)]);
        }
        
        // Create polygon
        this.createShape();
    };
    
    this.tick = function(delta){
        // Chane variance based off of x value
        if(this.x > 350){
            this.variance = 17;
        }else if(this.x > 250){
            this.variance = 12;
        }else if(this.x > 200){
            this.variance = 9;
        }else if(this.x > 100){
            this.variance = 7;
        }else{
            this.variance = 4;
        }
        
        for(var i = 0;i <= this.numDiffs;i++){
            this.diffs[i][0] += delta * this.diffs[i][1] * this.diffs[i][2];
            if(this.diffs[i][0] < -this.variance){
                this.diffs[i][1] = 1;
                this.diffs[i][2] = getRandomFloat(this.speed - this.speedVar, this.speed + this.speedVar);
            }else if(this.diffs[i][0] > this.variance){
                this.diffs[i][1] = -1;
                this.diffs[i][2] = getRandomFloat(this.speed - this.speedVar, this.speed + this.speedVar);
            }
        }
        
        // Update shape
        app.stage.removeChild(this.shape);
        this.createShape();
    };
    
    this.createShape = function(){
        this.shape = new PIXI.Graphics();
        this.shape.lineStyle(6, 0xAAAAAA);
        this.shape.moveTo(-4, this.y);
        for(var i = 0;i <= this.numDiffs;i++){
            var xp = i * this.x / this.numDiffs;
            var yp = this.y + this.diffs[i][0];
            if(i == 0) yp = this.y;
            if(i == this.numDiffs){
                xp = this.x;
                yp = this.y;
            }
            this.shape.lineTo(xp, yp);
        }
        app.stage.addChild(this.shape);
    };
    
    this.init();
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}