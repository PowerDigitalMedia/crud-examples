var async = require('async');
var db_connect = require('mysql-db-connect');


module.exports=function(app)
{

	app.post('/process-crud-mysql',function(req,res){


		if(req.headers.host 
		&& req.headers.host != undefined
		)      
		{
			//Reference host to process request

			var host = req.headers.host;


		}//==


		
		var ajaxObj = {};
		var ajaxArr = req.body['ajaxArr'];
		
		for(i=0; i < ajaxArr.length; i++) 
		{
			var keyval = ajaxArr[i];
			var kv = keyval.split("-DELIMITER-");
			var key = kv[0];
			var val = kv[1];
			
			ajaxObj[key]=val;
					
		}//for

	
		var _VARS = JSON.parse(ajaxObj['_VARS']);


		var ob = {};

		var runit = true;
		if(!runit)
		{
		//skip



	
				var sof = 'SUCCESS';
				
				var R = {

					'sof'		:sof,
					'result'	: {'postback':'CRUD Test'}

				};
				//var job = JSON.stringify(R);
				res.send(R);
			
				
			
		}
		else
		{
		//run



			async.waterfall(

				//===========================================
				//PROCESSING FUNCTIONS
				// - array of callback functions 
				// - delivers result to final function
				//===========================================
				[
				//############################################################################
				//############################################################################
				//############################################################################
				// select
				

					function(callback){


						if(_VARS['recid']
						&& _VARS['recid'] != undefined
						&& _VARS['recid'] != "new"
						)
						{

		
				
							/*
				
							===================
							RECORD
							===================
				
							"id": 1234,
							"recid":"007"
							"name":"James Bond"
							"email": "james@bond.com",
							"phone": "555-555-5555",
							"address": "10 Downing Street",
							"city": "London",
							"state": "Ohio (OH)",
							"country": "United States",
							"zipcode": "43140",
							"notes":""
				
							*/
				
				
							var TABLE = 'records';
				
							var SQL = "SELECT * FROM " + TABLE + " WHERE ?";
		
								var WHERE = {recid:_VARS['recid']};

							var VALUES = [WHERE];
		

							db_connect(database_name, SQL, VALUES, function(err, rows) {

								if(err)
								{ 
									ob['select_error'] = true;
									ob['select_result'] = [];
									callback(err,ob);

								}else{

									
									ob['select_error'] = false;
									ob['select_result'] = rows[0];

									callback(null, ob);

								}//##


							});


		

						
						}
						else
						{

							ob['select_error'] = "skipped";
							ob['select_result'] = [];
							callback(null, ob);


						}//===


					},









				//############################################################################
				//############################################################################
				//############################################################################
				// insert

				
					function(ob,callback){



						if(_VARS['recid'] 
						&& _VARS['recid'] != undefined
						&& _VARS['recid'] == 'new'
						&& ob['select_error'] == 'skipped'
						)
						{


				
							/*
				
							===================
							RECORD
							===================
				
							"id": 1234,
							"recid":"007"
							"name":"James Bond"
							"email": "james@bond.com",
							"phone": "555-555-5555",
							"address": "10 Downing Street",
							"city": "London",
							"state": "Ohio (OH)",
							"country": "United States",
							"zipcode": "43140",
							"notes":""
				
							*/
				
					
			
		
				
							var TABLE = 'records';
				
		
							var SQL = "INSERT INTO " + TABLE;
							SQL += "(name,email,phone,address,city,state,country,zipcode)";
							SQL += "VALUES ?";

				
				
				
							var VALUES = [];



								function pad(n){
									return n < 10 ? "0" + n : n
								};

								var d=new Date();
								var dash = "-";

								var timestamp = d.getFullYear()+dash+
									pad(d.getMonth()+1)+dash+
									pad(d.getDate())+dash+
									pad(d.getHours())+dash+
									pad(d.getMinutes())+dash+
									pad(d.getSeconds());
								
								var timestamp = timestamp.toString();
								var timestamp = timestamp.replace(/\-/g,'');
								var timestamp = parseInt(timestamp);
								
								console.log("TIMESTAMP: "+timestamp);

				
								var randnum = Math.floor(Math.random() * 9000 + 1000);

								var recid = parseInt(timestamp) + parseInt(randnum);
								var recid = recid.toString();
								var recid = recid.replace(/\-/g,'');


								var name 	= _VARS['name'];
								var email 	= _VARS['email'];
								var phone 	= _VARS['phone'];
								var address = _VARS['address'];
								var city 	= _VARS['city'];
								var state 	= _VARS['state'];
								var country = _VARS['country'];
								var zipcode = _VARS['zipcode'];

								var VAL = [name,email,phone,address,city,state,country,zipcode];
				
							VALUES.push(VAL);
				
				
			
							db_connect(database_name, SQL, [VALUES], function(err, arg) {
					
								if(err)
								{
		
									ob['insert_error'] = true;
									ob['insert_result'] = err;
									callback(null,ob);

								}else{

									ob['insert_error'] = false;
									ob['insert_result'] = arg;
									callback(null,ob);

								}//#
					
							});
		


						}else{


							ob['insert_error'] = "skipped";
							ob['insert_result'] = "skipped";
							callback(null,ob);


						}//==



					},






				//############################################################################
				//############################################################################
				//############################################################################
				// update


					function(ob,callback){


					
						console.log("=========================");
						console.log("update");
						console.log("=========================");

			
						if(_VARS['recid'] 
						&& _VARS['recid'] != undefined
						&& _VARS['recid'] != 'new'
						&& !ob['select_error']
						&& ob['insert_error'] == 'skipped'
						)
						{
					
				

							/*
							===================
							RECORD
							===================
				
							"id": 1234,
							"recid":"007"
							"name":"James Bond"
							"email": "james@bond.com",
							"phone": "555-555-5555",
							"address": "10 Downing Street",
							"city": "London",
							"state": "Ohio (OH)",
							"country": "United States",
							"zipcode": "43140",
							"notes":""
				
							*/
				
				
							var TABLE = 'records';


							var recid 			= _VARS['recid'];
							var name 			= _VARS['name'];
							var email 			= _VARS['email'];		
							var phone 			= _VARS['phone'];
							var address 		= _VARS['address'];
							var city 			= _VARS['city'];
							var state  			= _VARS['state'];
							var country 		= _VARS['country'];
							var zipcode 		= _VARS['zipcode'];


			
							//=====================================
							// IN
							//=====================================
				
							var IN = [];
							IN.push(recid);
				
				
				
							//=====================================
							// q strings
							//=====================================

							var q_recid = "'" + recid + "'";
					
							var q_name = "'" + name + "'";
							var q_email = "'" + email + "'";		
							var q_phone = "'" + phone + "'";
							var q_address = "'" + address + "'";
							var q_city = "'" + city + "'";
							var q_state = "'" + state + "'";
							var q_country = "'" + country + "'";
							var q_zipcode = "'" + zipcode + "'";

							var q_data = "'" + data + "'";

				
				
							//=====================================
							// when_then
							//=====================================
				
							//var when_then_recid = '';
		
							var when_then_name = '';
							var when_then_email = '';
							var when_then_phone = '';
							var when_then_address = '';
							var when_then_city = '';
							var when_then_state = '';
							var when_then_country = '';
							var when_then_zipcode = '';

						
							when_then_name += "WHEN " + q_recid + " THEN " + q_name + " ";
							when_then_email += "WHEN " + q_recid + " THEN " + q_email + " ";
							when_then_phone += "WHEN " + q_recid + " THEN " + q_phone + " ";
							when_then_address += "WHEN " + q_recid + " THEN " + q_address + " ";
							when_then_city += "WHEN " + q_recid + " THEN " + q_city + " ";
							when_then_state += "WHEN " + q_recid + " THEN " + q_state + " ";
							when_then_country += "WHEN " + q_recid + " THEN " + q_country + " ";
							when_then_zipcode += "WHEN " + q_recid + " THEN " + q_zipcode + " ";

					
							//====================================
							// sql
							//====================================
								
							//You can use an array of objects:
							//connection.query('UPDATE user SET ? WHERE ?', [{ Name: name }, { UserId: userId }])
					
							var SQL = "UPDATE " + TABLE;
								SQL += " SET";
					
									//SQL += " recid = CASE recid " + when_then_recid + "END,";

									SQL += " status = CASE recid " + when_then_status + "END,";
				
									SQL += " name = CASE recid " + when_then_name + "END,";
									SQL += " email = CASE recid " + when_then_email + "END,";
									SQL += " phone = CASE recid " + when_then_phone + "END,";
									SQL += " address = CASE recid " + when_then_address + "END,";
									SQL += " city = CASE recid " + when_then_city + "END,";
									SQL += " state = CASE recid " + when_then_state + "END,";
									SQL += " country = CASE recid " + when_then_country + "END,";
									SQL += " zipcode = CASE recid " + when_then_zipcode + "END ";//no comma add space on last case

								SQL += " WHERE recid IN (?)";
				
				
							var VALUES = [IN];//WHERE IN
				


					


							//#####################################################
							//#####################################################
							//#####################################################
							
							console.log("SQL: "+SQL);
							console.log("VALUES: "+VALUES);

							db_connect(database_name, SQL, VALUES, function(err, arg) {//update VALUES = array of objects
							//db_connect(database_name, SQL, [VALUES], function(err, arg) {//insert [VALUES] = array of arrays wrapped in array
					
								if(err) 
								{
									
									ob['update_error'] = err;
									ob['update_result'] = arg;
									callback(null,ob);
								}else{
		
									ob['update_error'] = false;
									ob['update_result'] = arg;
									callback(null,ob);
								}//#
					
							});
		
						
						}
						else
						{

							ob['update_error'] = true;
							ob['update_result'] = [];

							callback(null, ob);


						}//===


					},





				//############################################################################
				//############################################################################
				//############################################################################
				// delete


					function(ob,callback){


					
						console.log("=========================");
						console.log("delete");
						console.log("=========================");

			
						if(_VARS['recid'] 
						&& _VARS['recid'] != undefined
						&& _VARS['recid'] != 'new'
						&& !ob['select_error']
						&& ob['insert_error'] == 'skipped'
						)
						{
					
							var TABLE = 'records';

							var SQL = "DELETE FROM " + TABLE + " WHERE ?";

								var WHERE = {recid: _VARS['recid']};
								
							var VALUES = [WHERE];


							db_connect(database_name, SQL, VALUES, function(err, rows) {

								if(err)
								{ 
									ob['delete_error'] = true;
									ob['delete_result'] = [];
									callback(err,ob);

								}else{

									
									ob['delete_error'] = false;
									ob['delete_result'] = rows;

									callback(null, ob);

								}//##


							});


						}
						else
						{

							ob['delete_error'] = true;
							ob['delete_result'] = [];

							callback(null, ob);


						}//===



			
					},





				//############################################################################
				//############################################################################
				//############################################################################
				// summary


					function(ob, callback){


						//check and verify here

						console.log(JSON.stringify(ob,null,2));
						callback(null, ob);

					}




				], 
				//==========================================================
				//FINAL
				// - run any processing and send 
				//==========================================================

				function (err, result) {
				
		
					var sof = "SUCCESS";
					if(result['error']) var sof = "FAILED";


					var R = {
			
						'sof':sof,
						'result':result
					};
					res.send(R);
				

		
				}



			);//== async.waterfall


		}//== runit
		

	});//== app post
	

}//== module




