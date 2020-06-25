function createBoxMesh(w, h, d, material){
	var g = new THREE.BoxGeometry(w, h, d);
	var m = new THREE.Mesh(g, material);
	
	return m;
}

function createSphereMesh(radius, segw, segh, material){
	var g = new THREE.SphereGeometry(radius, segw, segh);
	var m = new THREE.Mesh(g, material);
	
	return m;
}

function createPlaneMesh(w, h, material){
	var g = new THREE.PlaneGeometry(w, h);
	var m = new THREE.Mesh(g, material);
	
	return m;
}

function createParticlePoints(amount, w, h, d, minvel, maxvel){//MUST BE POINT CLOUD MATERIAL
	var particles = new THREE.Geometry;
	var tx, ty, tz;
	
	for(var i = 0;i < amount;i++){
		tx = Math.random() * w - w / 2;
		ty = Math.random() * h - h / 2;
		tz = Math.random() * d - d / 2;
		
		particles.vertices.push(new THREE.Vector3(tx, ty, tz));
		particles.vertices[i].velocity = Math.random() * (maxvel - minvel) + minvel;
	}
	
	return particles;
}

function createParticleSystem(pts, material){
	return new THREE.PointCloud(pts, material);
}

function updateParticleVelocity(particles, points, resetPointZ, w, h, d, minvel, maxvel){
	var tv;
	
	for(var i = 0;i < particles.geometry.vertices.length;i++){
		tv = points.vertices[i].velocity;
		particles.geometry.vertices[i].z += tv;
		if(particles.geometry.vertices[i].z >= resetPointZ){//RESET PARTICLE
			var tx = Math.random() * w - w / 2;
			var ty = Math.random() * h - h / 2;
			var tz = Math.random() * d - d / 2;
			
			particles.geometry.vertices[i].x = tx;
			particles.geometry.vertices[i].y = ty;
			particles.geometry.vertices[i].z = tz;
			
			points.vertices[i].velocity = Math.random() * (maxvel - minvel) + minvel;
		}
	}
}

function createAmbientLight(r, g, b, i){
	var al = new THREE.AmbientLight();
	al.color.setRGB(r * i, g * i, b * i);
	
	return al;
}

function createPointLight(hex, intensity, dist){
	var pl = new THREE.PointLight(hex, intensity, dist);
	
	return pl;
}

function toRadians(d){
	return d * (Math.PI / 180);
}