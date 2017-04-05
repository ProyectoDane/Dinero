'use strict';

function SoundsManager() {
	this.currentSound = null;
	this.sounds = new Array();
}

SoundsManager.prototype.constructor = SoundsManager;

SoundsManager.prototype.playSound = function(name, important) {
	important = (important == undefined) ? false : true;

	try {
		this.currentSound.instance.stop();
		this.currentSound.instance.release();
	} catch(error) {
		console.log("can't stop current sound");
	}

	var src = "";
	if (cordova.platformId === 'android') {
        src += '/android_asset/www/';
    }
	src += name;

	var sound = new Media(src, this.onSuccessMedia, this.onErrorMedia, this.onStatusMedia);
    sound.play();

	var soundObj = {};
	soundObj.name = name;
	soundObj.isPlaying = true;
	soundObj.instance = sound;

	this.currentSound = soundObj;
	var sound = null;
}

SoundsManager.prototype.onSuccessMedia = function() {
	this.stop();
	this.release();
}

SoundsManager.prototype.onErrorMedia = function(error) {
	console.log("onErrorMedia",error);
}

SoundsManager.prototype.onStatusMedia = function(error) {
}

SoundsManager.prototype.toString = function() {
	return "SoundsManager";
}
