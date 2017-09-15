var audio = {
	initialize: function(manager) {
		this.soundsManager = manager;
		this.prefs = plugins.appPreferences;
		this.prefs.fetch(this.setSound, this.fail, "isSoundDeactivated");
		var elms = document.querySelectorAll("#v-btn-cd");
		for(var i = 0; i < elms.length; i++) {
			elms[i].addEventListener("touchend", this.changeAudioState, false);
		}
	},

	changeAudioState: function() {
		var get = function(value) {
			var newValue = true;
	        if (value == true) {
				newValue = false;
	        } 
	        audio.prefs.store(audio.ok, audio.fail, "isSoundDeactivated", newValue);
	        audio.prefs.fetch(audio.setSound, audio.fail, "isSoundDeactivated");
	    };
	    audio.prefs.fetch(get, this.fail, "isSoundDeactivated");
    }, 

    setSound: function(value) {
    	var elms = document.querySelectorAll("#v-btn-cd");
    	if (value == true) {
    		for(var i = 0; i < elms.length; i++) {
				elms[i].classList.remove('v-btn-on');
				elms[i].classList.add('v-btn-off');
			}
			audio.soundsManager.setEnabled(false);
    	} 
    	else if (value == false) {
    		for(var i = 0; i < elms.length; i++) {
				elms[i].classList.remove('v-btn-off');
				elms[i].classList.add('v-btn-on');
			}
			audio.soundsManager.setEnabled(true);
    	} 
    },

    ok: function(value) {
		console.log(value);
    },

	fail: function(error) {
		console.log(error);
	}
}