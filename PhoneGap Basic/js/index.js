var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
		$(app.onDOMLoad());
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        
		$(".listening").hide();
		$(".received").show();
		
    },
	onDOMLoad: function(){
		
	}
};
