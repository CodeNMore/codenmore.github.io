function Tear(x){
    this.x = x;
    this.numDiffs = 8;
    this.variance = 35;
    this.diffs = [];
    this.shape = null;
    
    this.init = function(){
        // Create initial tears
        for(var i = 0;i <= this.numDiffs;i++){
            this.diffs.push([Math.floor(Math.random() * this.variance * 2 - this.variance),
                            ((Math.random() >= 0.5) ? 1 : -1),
                            (Math.random() / 1.5)]);
        }
        
        // Create polygon
        this.createShape();
    };
    
    this.tick = function(delta){
        for(var i = 0;i <= this.numDiffs;i++){
            this.diffs[i][0] += delta * this.diffs[i][1] * this.diffs[i][2];
            if(this.diffs[i][0] < -this.variance){
                this.diffs[i][1] = 1;
                this.diffs[i][2] = Math.random() / 1.5;
            }else if(this.diffs[i][0] > this.variance){
                this.diffs[i][1] = -1;
                this.diffs[i][2] = Math.random() / 1.5;
            }
        }
        
        // Update shape
        app.stage.removeChild(this.shape);
        delete this.shape;
        this.createShape();
    };
    
    this.createShape = function(){
        this.shape = new PIXI.Graphics();
        this.shape.beginFill(0xFFFFFF);
        this.shape.drawPolygon(this.genPoints());
        this.shape.endFill();
        app.stage.addChild(this.shape);
    };
    
    this.genPoints = function(){
        var extra = 0;
        var ret = [width + extra, 0, width + extra, height];
        
        for(var i = 0;i <= this.numDiffs;i++){
            ret.push(this.x + this.diffs[i][0] - ((i == 0 || i == this.numDiffs) ? 30 : 0));
            ret.push(height / this.numDiffs * (this.numDiffs - i));
        }
        
        ret.push(width + extra);
        ret.push(0);
        return ret;
    };
    
    this.init();
}

function StarField(numstars){
    this.numStars = numstars;
    this.spread = 64;
    this.speed = 0.16;
    this.stars = [];
    
    this.init = function(){
        // Create all stars
        for(var i = 0;i < this.numStars;i++){
            this.stars.push(new Star(this.spread));
        }
    };
    
    this.tick = function(delta){
        for(var i = 0;i < this.numStars;i++){
            var star = this.stars[i];
            star.tick(delta, this.speed);
        }
    };
    
    this.init();
}

function Star(spread){
    this.x = 1;
    this.y = 1;
    this.z = 1;
    this.ox = 0;
    this.spread = spread;
    this.texture = null;
    
    this.init = function(){
        this.texture = new PIXI.Graphics();
        this.texture.beginFill(0xFFFFFF);
        this.texture.drawRect(0, 0,
                        Math.floor(Math.random() * 3) + 1,
                        Math.floor(Math.random() * 3) + 1);
        this.texture.endFill();
        app.stage.addChild(this.texture);
        this.reInit();
    };
    
    this.reInit = function(){
        this.x = 2 * (Math.random() - 0.65) * this.spread;
        this.y = 2 * (Math.random() - 0.5) * this.spread;
        this.z = (Math.random() + 0.000001) * this.spread;
        this.ox = 0;
    };
    
    this.tick = function(delta, speed){
        this.z -= delta * speed;
        if(this.z <= 0){
            this.reInit();
            return;
        }

        this.ox += delta * 0.25;
        var x = (((this.x - this.ox) / this.z) * halfWidth + halfWidth);
        var y = ((this.y / this.z) * halfHeight + halfHeight);
        
        if(x < 320) this.z += delta * speed * 1.3;
        
        if(x < 0 || x >= width || y < 0 || y >= height){
            this.reInit();
            return;
        }
        
        this.texture.x = x;
        this.texture.y = y;
    };
    
    this.init();
}