var accWatchID;
var comWatchID;
var geoWatchID;
var mediaObj;
var mediaPause = false;
var filename = "sampleFile.txt";
var filePath = "file://sdcard/sampleFile.txt";

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
		$(app.onDOMLoad());
    },
	onDOMLoad: function(){
		document.addEventListener('deviceready', this.onDeviceReady, false);
		
		$("#apiselect").change(function(e) {
			
            var val = this.options[this.selectedIndex].value;
			
			$(".api-div").css("display","none");
			$("#" + val + "-api").css("display","block");
			
        });
		
		$("#intro-api").css("display","block");		
		
	},
    onDeviceReady: function() {
		
		document.addEventListener("backbutton", app.backKeyDown, false); 
		//document.addEventListener("menubutton", app.menuKeyDown, false); 
		
		//Device
		$("#device-api").append("Device Model: " +device.model+ "<br><br>");
		$("#device-api").append("PhoneGap Version: " +device.cordova+ "<br><br>");
		$("#device-api").append("Platform: " +device.platform+ "<br><br>");
		$("#device-api").append("UUID: " +device.uuid+ "<br><br>");
		$("#device-api").append("Version: " +device.version+ "<br><br>");
		
		//Battery		
		window.addEventListener("batterystatus", app.batteryStatus, false);
		
		//Network Connection
		app.checkConnection();
		
		//Notification/Vobration
		$("#alert").click(function(e) {  app.showAlert();  });
		$("#confirm").click(function(e) {  app.showConfirm()();  });
		$("#beep").click(function(e) {  app.beep();  });
		$("#vibrate").click(function(e) {  app.vibrate();  });
		
		//Accelerometer
		//navigator.accelerometer.getCurrentAcceleration(app.accelerometerSuccess, app.onError);
		accWatchID = navigator.accelerometer.watchAcceleration(app.accelerometerSuccess,
                                                       app.onError,
                                                       { frequency: 1000 });
													   
		//Compass											   
		//navigator.compass.getCurrentHeading(app.compassSuccess, app.onError);		
		comWatchID = navigator.compass.watchHeading(app.compassSuccess, app.onError, {frequency: 1000});
		
		//Geolocation
		//navigator.geolocation.getCurrentPosition(app.geolocationSuccess, app.onError);
		geoWatchId = navigator.geolocation.watchPosition(app.geolocationSuccess, app.onError, { timeout: 30000 });
		
		//Contacts
		$("#contactFind").click(function(e) {
            app.findContacts();
        });
		
		//Media
		$("#playMedia").click(function(e) {
            app.mediaPlay();
        });
		
		$("#pauseMedia").click(function(e) {
            app.mediaPause();
        });
			
		$("#stopMedia").click(function(e) {
            app.mediaStop();
        });
		
		$("#takePhoto").click(function(e) {
            app.clickPhoto();
        });
		
		$("#writeBtn").click(function(e) {
            app.writeFile();
        });
		
		$("#readBtn").click(function(e) {
            app.readFile();
        });
    },
	backKeyDown: function(e){
		e.preventDefault();	
		navigator.notification.confirm("Are you sure?", function (button) { 
								if(button==1){
									return;
								}else{
									navigator.app.exitApp();
								}
							}, "Exit Application", "No,Yes");
	},
	menuKeyDown: function(e){	
		e.preventDefault();	
	},
	batteryStatus: function(info){
		if(info.isPlugged)
			$("#battery-api").append("<br><br>Plugged in - Charging : " + info.level + "%");
		else
			$("#battery-api").append("On Battery<br>" + info.level);
		
		$(".batterylvl").css("width", (info.level * 2) + "px !important");
		
	},
	checkConnection: function(){
		var networkState = navigator.connection.type;
	
		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.CELL]     = 'Cell generic connection';
		states[Connection.NONE]     = 'No network connection';
	
		$("#connection-api").append('<br><br>Connection type: ' + states[networkState]);
	},
	showAlert:function() {
		function alertDismissed() {
			console.log("Alert dismissed");
		}
		navigator.notification.alert(
			'Phonegap Notification Alert!',  // message
			alertDismissed,         // callback
			'PhoneGap Plugin',            // title
			'Done'                  // buttonName
		);    
	},
	showConfirm: function() {
		function onConfirm(button) {
			alert('You selected button ' + button);
		}
		navigator.notification.confirm(
				'PhoneGap Confirm Dialog!',  // message
				onConfirm,              // callback to invoke with index of button pressed
				'PhoneGap Plugin',            // title
				'Ok,Exit'          // buttonLabels
			);    
	},
	beep: function() {
		navigator.notification.beep(2);
	},
	vibrate: function() {
		navigator.notification.vibrate(0);
	},
	accelerometerSuccess:function(acceleration){
		$("#acc").html('Acceleration X: ' + acceleration.x + '<br><br>' +
          'Acceleration Y: ' + acceleration.y + '<br><br>' +
          'Acceleration Z: ' + acceleration.z + '<br><br>' +
          'Timestamp: '      + acceleration.timestamp + '<br><br>');
	},
	compassSuccess:function(heading){
		$("#com").html('Heading: ' + heading.magneticHeading);
	},
	geolocationSuccess: function(position) {
		$("#geo").html('Latitude: ' + position.coords.latitude          + '<br><br>' +
			  'Longitude: '         + position.coords.longitude         + '<br><br>');
	},
	findContacts: function () {
		var obj = new ContactFindOptions();
		obj.filter = "";
		obj.multiple = true;
		navigator.contacts.find(["id" ,"displayName", "name", "phoneNumbers"], app.contactSuccess, app.onError, obj);
	},
	contactSuccess: function (contacts) {
		$("#contactList").append("<strong>" + contacts.length + "</strong> contacts returned.<br><br>");
		
		
		for (var i = 0; i < 5; i++) {     
			if (contacts[0].name && contacts[0].name.formatted)   
				$("#contactList").append(contacts[i].name.formatted +"<br>");				
			
			/*
			for (var j=0; j<contacts[i].phoneNumbers.length; j++) {
				 $("#contactList").append("Type: " + contacts[i].phoneNumbers[j].type + ": " + "Value: "  + contacts[i].phoneNumbers[j].value);
			}*/
		}
	},
	mediaPlay: function()
	{
		mediaObj = new Media(app.getPhoneGapPath() + 'mp3/threekills.mp3', function(){
				//Success
				mediaObj.release();
			}, function(error){ 
			//Error
			alert('Error!');
		});
		mediaObj.play();
	},
	mediaPause: function()
	{
		if(!mediaPause)
		{	mediaObj.pause();	mediaPause = true;	}
		else
		{	mediaObj.play();	mediaPause = false;	}
		
	},
	mediaStop: function(){
		mediaObj.stop();
		clearInterval(mediaTimer);
	},
	getPhoneGapPath: function(){
		var path = window.location.pathname;
		path = path.substr( path, path.length - 10 );
		return 'file://' + path;
	},
	clickPhoto: function(){
		navigator.camera.getPicture(function(imageData){
				var image = document.getElementById('photo');
				image.src = "data:image/jpeg;base64," + imageData;
			}, app.onError, { quality: 100, targetWidth: 200, targetHeight:200, destinationType: Camera.DestinationType.DATA_URL  });
	},
	readFile: function(){
		
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
			var sdcardEntry = fileSystem.root;
			sdcardEntry.getFile(
				filename,
				{create:true},
				function(fileEntry){
			fileEntry.file(
				function(file){
					var fileReader = new FileReader();
					fileReader.onloadend = function(evt){
						$("#textarea").val(evt.target.result);
					};
					fileReader.readAsText(file);
				},
				function(error){
					alert("Got error while reading");
				})});
		},    //error callback
		function(error){
			alert(filename + " not present, please add content and click Save first");
		});
		
	},
	writeFile: function(){
	
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
			var sdcardEntry = fileSystem.root;
			sdcardEntry.getFile(
				filename,
				{create:true},
				function(fileEntry){
					fileEntry.createWriter(
						function(fileWriter){
							 fileWriter.onwrite = function(evt) {
								alert("Write was successful!");
								$("#textarea").val('');
							 };
							 fileWriter.write($("#textarea").val());
						},
						function(error){
							alert("Failed to get a file writer");									
						});
				},
				function(error){
					alert("Got error while reading");
				}
				) ;          
			
		}, function(error){
			alert("Got Error while gaining access to file system");
		});	
	},
	onError: function(e) {
		alert('Error!');
	}
};