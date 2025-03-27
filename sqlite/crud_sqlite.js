var async = require('async');
var sqlite3 = require('sqlite3').verbose();



module.exports=function(app)
{

	app.post('/process-crud-sqlite',function(req,res){


	
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
			var kv = keyval.split("-|AJXPST|-");
			var key = kv[0];
			var val = kv[1];
			
			ajaxObj[key]=val;
					
		}//for


	
		var _VARS = JSON.parse(ajaxObj['_VARS']);

		var v1 = _VARS['var_1'];
		var v2 = _VARS['var_2'];


		//--------------------------------------------

		var sqlite_case = 'file';//memory or file
	
		//---------------------------------------------

		var runit = true;
		if(!runit)
		{
		//skip




				var sof = 'TEST';
		
				var R = {
					'sof'		: sof,
					'result'	: {'postback':'CRUD Test'}
				};
				var job = JSON.stringify(R);
				res.send(job);
			

		}
		else
		{

			
			var ob = {};


			var sqlite_case = 'file';//memory or file

			switch(sqlite_case)
			{
			case'memory':

				var sqlite_path = ':memory:';
			break;
			case'file':

				var sqlite_path = 'sqlite.db';
			break;
			}//switch
			//=======



			_VARS['sqlite_path'] = sqlite_path;


			let sqlite_connect = new sqlite3.Database(sqlite_path, sqlite3.OPEN_READWRITE, (err) => {

				if(err) 
				{


					var ajax_msg = 'No sqlite Connection';
					var sof = 'FAILED';
					
					var R = {

							'alrt':alrt,
							'sof':sof,
							'result':_VARS

							};
					var job = JSON.stringify(R);
					res.send(job);




				}
				else
				{

					//===================================================================
					//async =============================================================
					//===================================================================
					async.waterfall(
						
						//===========================================
						//PROCESSING FUNCTIONS
						// - array of callback functions 
						// - delivers result to final function
						//===========================================
						[

					
							// --- CREATE -----------------------------------------------
		
							function(callback){


								console.log("===============================");
								console.log("CREATE");
								console.log("===============================");


								
								var skip_create_table = false;
							
								if(skip_create_table)
								{

									callback(null, ob);
									

								}
								else
								{
								
								
									var sql = "CREATE TABLE IF NOT EXISTS auth(";

										sql += "id integer PRIMARY KEY,";
										sql += "uid text NOT NULL UNIQUE,"
										sql += "hash text NOT NULL";
				
									sql += ")";
								
									
					
									sqlite_connect.run(sql, function(err) {
			
			
										if(err) 
										{
											console.log("...Error");

											ob['sqlite_create_err'] = true;
											ob['sqlite_create_result'] = err.message;
											callback(null, ob);
			
										}else{

											console.log("...Ok");

											ob['sqlite_create_err'] = false;
											ob['sqlite_create_result'] = `Was Created Or Exists`;
											callback(null, ob);
										}//====
			
			
									});

								

								}//siip
								//=====

							},
							//======
		
		
		


				

	
							// --- SELECT - UPDATE / IMSERT ------------------------------


							function(ob,callback){
			
		

								console.log("===============================");
								console.log("SELECT - UPDATE/INSERT");
								console.log("===============================");



								let sql = `SELECT * FROM auth
													WHERE uid = ?`;

								let values = ["123"];

								sqlite_connect.get(sql, values, (err, row) => {
									
									if(err) 
									{

										console.log("...Error");


										ob['sqlite_check_err'] = true;
										ob['sqlite_check_result'] = err.message;
										callback(null, ob);
				


									}
									else
									{


										console.log("...Update");
										

										//-------------------------------------------

										//update

										//-------------------------------------------
										if(row && row != undefined)
										{

											ob['sqlite_check_err'] = false;
											ob['sqlite_check_result'] = "\nSession found run update";


											var stored_hash = row['hash'];
										
											
						

											var uid = '123';
											var hash = '###';
								
											let params = [hash, uid];


											let sql = `UPDATE auth
														SET hash = ?
														WHERE uid = ?`;

								
											sqlite_connect.run(sql, params, function(err) {


												if(err) 
												{
													ob['sqlite_update_err'] = true;
													ob['sqlite_update_result'] = err.message;
													callback(null, ob);
							
												}else{
					
													ob['sqlite_update_err'] = false;
													ob['sqlite_update_result'] = `Row(s) updated: ${this.changes}`;
													callback(null, ob);
													
												}//====


											
											});





										}
										//-------------------------------------------

										//insert

										//-------------------------------------------
										else
										{

											
											console.log("...Insert");
										

											ob['sqlite_check_err'] = false;
											ob['sqlite_check_result'] = "\nSession NOT found run insert";
										

											var uid = '123';
											var hash = '###';
										


											let values = [uid,hash];
											let sql = 'INSERT INTO auth(uid,hash) VALUES (?,?)';
			
											sqlite_connect.run(sql, values, function(err) {
					
												if(err) 
												{
													ob['sqlite_insert_err'] = true;
													ob['sqlite_insert_result'] = err.message;
													callback(null, ob);
							
												}else{
					
													ob['sqlite_insert_err'] = false;
													ob['sqlite_insert_result'] = `Rows inserted ${this.changes}`;
													callback(null, ob);
												
												}//====
					
					
											});


										}//checked
									

									}

								});
								



							},
					



				

		
							// --- SELECT -------------------------------------------------
		
	
							function(ob,callback){
								
								console.log("===============================");
								console.log("SELECT");
								console.log("===============================");


								let sql = `SELECT * FROM auth
													WHERE uid = ?`;

								let values = ["123"];


		
								sqlite_connect.each(sql, values, (err, row) => {

				
									//console.log(`${row.firstName} ${row.lastName} - ${row.email}`);
									

									if(err) 
									{

										console.log("...Error");

										ob['sqlite_select_err'] = true;
										ob['sqlite_select_result'] = err.message;
										callback(null, ob);
				
									}else{

										console.log("...Ok");

										ob['sqlite_select_err'] = false;
										ob['sqlite_select_result'] = row['uid']+" "+row['hash'];
										callback(null, ob);
										
									}//====


								});
								

							},







					
							// --- DELETE --------------------------------------------------
		
							function(ob,callback){
								


								console.log("===============================");
								console.log("DELETE");
								console.log("===============================");



								var sql = `DELETE FROM auth WHERE uid=(?)`;
								var params = ["123"];

								sqlite_connect.run(sql, params, function(err) {

									if(err) 
									{

										console.log("...Error");

										ob['sqlite_delete_err'] = true;
										ob['sqlite_delete_result'] = err.message;
										callback(null, ob);
				
									}else{
		
										console.log("...Ok");

										ob['sqlite_delete_err'] = false;
										ob['sqlite_delete_result'] = "Was Deleted";
										callback(null, ob);
										
									}//====

						
								});

						
							},
				

							
		
							



					
	
		
							// --- DROP ---------------------------------------------------
		
							function(ob,callback){
			

								console.log("===============================");
								console.log("DROP");
								console.log("===============================");


								let sql = 'DROP TABLE auth';
								sqlite_connect.run(sql, function(err) {

									if(err) 
									{

										console.log("...Error");

										ob['sqlite_drop_err'] = true;
										ob['sqlite_drop_result'] = err.message;
										callback(null, ob);
				
									}else{

										console.log("...Ok");

										ob['sqlite_drop_err'] = false;
										ob['sqlite_drop_result'] = `Was Dropped`;
										callback(null, ob);
										
									}//====
		
		
								});


								
		
		

							},
		
					
		
							
		
							// --- CLOSE --------------------------------------------------
	
	
							function(ob,callback){

			
								console.log("===============================");
								console.log("CLOSE");
								console.log("===============================");

	
								sqlite_connect.close((err) => {
									
									if(err) 
									{

										console.log("...Error");


										ob['sqlite_close_err'] = true;
										ob['sqlite_close_result'] = err.message;
										callback(null, ob);
									}else{


										console.log("...Ok");

										ob['sqlite_close_err'] = false;
										ob['sqlite_close_result'] = "'Closed the file sqlite database connection.'";
										callback(null, ob);
									}//====
		
								});
		
		
			
							}
							//====




		
			
						], 
			
			
						//==========================================================
						//FINAL
						// - run any processing and send 
						//==========================================================
			
						function (err, result) {
							
			
							var sof = 'FAILED';
			
							if(!result['sqlite_close_err'])
							{
								var sof = 'SUCCESS';
			
							}
			
							var R = {
			
									'alrt':alrt,
									'sof':sof,
									'result':result
			
									};
				
							res.send(R);
						
			
				
						}
			
			
			
					);
					//===================================================================
					//async =============================================================
					//===================================================================




				}//====
			
			});


		}//RUNIT
		

	});//== app post
	

}//== module




