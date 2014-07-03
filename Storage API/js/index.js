var db;
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
		$(app.onDOMLoad());   
    },
	onDOMLoad: function(){
		document.addEventListener('deviceready', this.onDeviceReady, false);
		db = window.openDatabase("appDB", "1.0", "Chemist Database", 500000);
	    db.transaction(app.createTables, app.txError, app.createTablesSuccess); 
		
		$("#save").click(function(e) {
            app.addEntry();
        });
	},
    onDeviceReady: function() {
      
    },
	txError: function(tx) {
	    alert("Database Error : " + tx.message);
	},
	createTables: function(tx) {
		tx.executeSql(
			"CREATE TABLE IF NOT EXISTS FIFAWC ( "+
			"Country TEXT, " +
			"Player TEXT, " +
			"Goals INTEGER)");				
	},
	createTablesSuccess: function() {		
		app.displayEntries();
	},
	addEntry: function(){
		db.transaction(
		function(tx){
			var sql = "INSERT INTO FIFAWC(Country, Player, Goals) VALUES('"+$("#country").val()+"','"+$("#player").val()+"','"+$("#goals").val()+"')";
			tx.executeSql(sql)
		}, 
		app.txError, 
		app.displayEntries);
	},	
	displayEntries: function(){
		
		$("#country").val('');
		$("#player").val('');
		$("#goals").val('');
		
		db.transaction(function(tx){
			var sql = 'SELECT * FROM FIFAWC';
			tx.executeSql(sql, [],
			function(tx, results) 
			{
				var len = results.rows.length;
				if(len > 0)
				{
					$("#list").html('');
					for (var i=0; i<len; i++)
					{
						$("#list").append(
						"<div style='width:90%; padding-left:5%;'>"+
						"<div style='width:40%; float:left;'>" + results.rows.item(i).Country + "</div>"+ 
						"<div style='width:40%; float:left;'>" + results.rows.item(i).Player + "</div>"+ 
						"<div style='width:10%; float:left;'>" + results.rows.item(i).Goals + "</div>"+
						"<div style='width:10%; float:left;'><button id='"+ results.rows.item(i).Player +"' onClick='javascript:app.delEntry(this)'>X</button></div>"+
						"</div>"
						);
					}
				}
				else
				{
					$("#list").html("<p>No Entries in Database</p>");
				}
				
			},
			app.txError)}, 
			app.txError);
	},
	delEntry: function(e){
		db.transaction(
		function(tx){
			var sql = "DELETE FROM FIFAWC WHERE Player ='"+ e.id +"'";
			tx.executeSql(sql)
		}, 
		app.txError, 
		app.displayEntries);
	},	
};
