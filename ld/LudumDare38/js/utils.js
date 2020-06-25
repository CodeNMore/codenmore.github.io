// Generates nice colors based on another color (input: 0xffffff, etc.)
function genNiceColor(baseHex, maximums){
	// Check for maximums
	maximums = (typeof maximums !== "undefined") ? maximums : {r: 255, g: 255, b: 255};
	// Get RGB components of the base
	var base = hexToRGB(baseHex);

	// Generate a random color
	var r = randomInt(0, maximums.r);
	var g = randomInt(0, maximums.g);
	var b = randomInt(0, maximums.b);

	// Combine to get a nicer color
	var fr = (r + base.r) / 2;
	var fg = (g + base.g) / 2;
	var fb = (b + base.b) / 2;

	// Return new hex color as integer
	return fb | (fg << 8) | (fr << 16);
}

// Random int (inclusive-inclusive)
function randomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// RGB to hex integer
function rgbToInt(rgb){
	return rgb.b | (rgb.g << 8) | (rgb.r << 16);
}

// Hex to RGB object
function hexToRGB(hex){
	var bi = parseInt(hex, 16);
	return {
		r: (bi >> 16) & 255,
		g: (bi >> 8) & 255,
		b: bi & 255
	};
}