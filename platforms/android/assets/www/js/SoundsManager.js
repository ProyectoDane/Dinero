'use strict';

function SoundsManager() {
	this.currentSound = null;
	this.sounds = new Array();
	this.enabled = true;
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

	if (this.enabled == false) {
		this.stopSound();
	}

	document.addEventListener("pause", function() {
        soundObj.instance.stop();
        soundObj.instance.release();
        soundObj.isPlaying = false;
    });
}

SoundsManager.prototype.playLast = function() {
	if (this.currentSound.isPlaying == false) {
		this.currentSound.instance.play();
		this.currentSound.isPlaying = true;
	}
}

SoundsManager.prototype.stopSound = function() {
	try {
		this.currentSound.instance.stop();
		this.currentSound.instance.release();
		this.currentSound.isPlaying = false;
	} catch(error) {
		console.log("can't stop the sound");
	}
}

SoundsManager.prototype.setEnabled = function(value) {
	this.enabled = value;

	if (this.enabled == false) {
		this.stopSound();
	} else {
		this.playLast();
	}
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
