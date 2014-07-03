var count = 0;
var volCounter = 0;
var pauseInterval;
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
		$(app.onDOMLoad());
    },
	onDOMLoad: function(){
		$("#appdata").append("DOM Loaded<br><br>");
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
    onDeviceReady: function() {
        $("#appdata").append("Device Ready<br><br>");
		
		document.addEventListener("pause", app.onPause, false);
		document.addEventListener("resume", app.onResume, false);
		document.addEventListener("backbutton", app.backKeyDown, false); 
		document.addEventListener("menubutton", app.menuKeyDown, false); 
    },
	onPause: function(){
		$("#appdata").append("App Paused<br><br>");
		pauseInterval = setInterval(app.countPause, 1000);
	},
	countPause:function(){
		count++;
	},
	onResume:function(){
		$("#appdata").append("App Resumed<br><br>");
		$("#appdata").append("App in background for " + count + " sec <br><br>");
		clearInterval(pauseInterval);
		count = 0;
	},
	backKeyDown: function(e){
		e.preventDefault();	
		$("#appdata").append("Back Key Down<br><br>");
	},
	menuKeyDown: function(e){	
		e.preventDefault();	
		$("#appdata").append("Menu Key Down<br><br>");
	}
};
