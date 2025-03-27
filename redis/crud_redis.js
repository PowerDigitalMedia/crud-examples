var async = require('async');


//---------------------------------------------

//https://hackernoon.com/using-redis-with-node-js-8d87a48c5dd7

var redis = require("redis");
let redisConfig = {

	host: '127.0.0.1',
	//host: '0.0.0.0',
	port: '6379',
	auth_pass: '[YOUR AUTH PASS',
	no_ready_check: true
	//return_buffers : true

}


/*

FOR REF

var redisClient  	= redis.createClient(redisConfig);

console.log(redisClient.connectionOption);
console.log(redisClient.options);
//redisClient.quit();

redisClient.on('connect', function() {

	console.log('Redis client connected');

});

redisClient.on('error', function (err) {

	console.log('Something went wrong ' + err);

});

*/

//----------------------------------------------



module.exports=function(app)
{

	app.post('/process-crud-redis',function(req,res){

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
				//#############################################################################
				//#############################################################################
				//#############################################################################
				// redis_connect

					function(callback){ 


						console.log('redis_connect');


						var redisClient = redis.createClient(redisConfig);
						redisClient.on('connect', function() {

							console.log('Redis client connected');

							ob['redis_connect'] = 'ok';
							callback(null,ob);
						
						});
						
						redisClient.on('error', function (err) {
						
							console.log('Something went wrong ' + err);

							ob['redis_connect'] = err;
							callback(null,ob);

						
						});


					},
					//func
					//====
		








	//############################################################################################################
	//############################################################################################################
	//############################################################################################################

	// RETRIEVES REC OR REX


						

					//========================================================



					//reckey - get the key



					//========================================================
		
					function(ob,callback){ 
		

						if(ob['redis_connect'] == 'ok'
						)
						{

							if(_VARS['recid'] 
							&& _VARS['recid'] != undefined 
							&& _VARS['recid'] != null
							&& _VARS['recid'] != 'new'
							)
							{

								var recid = _VARS['recid'];

								var cursor = '0';
								//var pattern = base_domain+":"+recid+':'+user+':*';
								var pattern = host+":"+recid+':*';
								var count = '100';

								ScanRedis(cursor,pattern,count,[],function(array){

									//console.log('Scan Complete');
									//console.log(JSON.stringify(array,null,2));

									//return false;

									ob['reckeys'] = {

										'error'		:false,
										'result'	:array

									};
									callback(null,ob);


								});
				
								function ScanRedis(cursor,pattern,count,array,callback){

									console.log("CURSOR: "+cursor);

									//console.log("PATTERN: "+pattern);

									var redisClient = redis.createClient(redisConfig);
									//redisClient.scan(cursor, 'MATCH',pattern, 'COUNT', 10, function(err, reply){
									redisClient.scan(cursor, 'MATCH',pattern, 'COUNT',count, function(err, reply){


										if(err)
										{

											array.push(err);

											//count = count - 1;


											var cursor = reply[0];

											
											console.log("ERROR: "+err);
											console.log("REPLY CURSOR: "+reply[0]);
											console.log("REPLY: "+JSON.stringify(reply[1],null,2));


											return ScanRedis(cursor,pattern,count,array,callback);

										}
										else
										{
											

											var cursor = reply[0];

											console.log("REPLY CURSOR: "+reply[0]);
											console.log("REPLY: "+JSON.stringify(reply,null,2));


											/*
											if(!arraylib.InArray(reply[1][0],array))
											{


												array.push(reply[1][0]);


											}//===
											*/
									

											if(cursor === '0'
											)
											{

												var keys = reply[1];
												keys.forEach(function(key,i)
												{   
													
													

													array.push(key);

													/*
													//DELETE
													redisClient.del(key, function(deleteErr, deleteSuccess){

														console.log(key);

													});
													*/

												});

												return callback(array);

											}
											else
											{


												var keys = reply[1];
												keys.forEach(function(key,i)
												{   
													
													

													array.push(key);

													/*
													//DELETE
													redisClient.del(key, function(deleteErr, deleteSuccess){

														console.log(key);

													});
													*/

												});



												return ScanRedis(cursor,pattern,count,array,callback);


											}//==

										}//===

									});


								}//func
								//=====



							}
							else
							{

								
								ob['reckeys'] = {

									'error'		:'skipped - No recid or user',
									'result'	:[]
								};
								callback(null,ob);


							}//==




						}
						else
						{

							
							ob['reckeys'] = {

								'error'		:'skipped',
								'result'	:[]
							};
							callback(null,ob);


						}//==



					},
					//func
					//====

		







					

					//========================================================



					//rex - get the record



					//========================================================
		
					function(ob,callback){ 
		

						if(ob['redis_connect'] == 'ok'
						)
						{

							if(!ob['reckeys']['error']
							&& ob['reckeys']['result'].length > 0
							)
							{

								var keys = ob['reckeys']['result'];

								//console.log(keys);
								//return false;

								var popar = [];
								for(var i=0; i < keys.length; i++)
								{

									popar.push(keys[i]);

								}//==


								Runner(popar,[]);
								function Runner(popar,array)
								{

									if(popar.length == 0
									) 
									{
										console.log("SelectAll Recs Complete");

										ob['rex'] = {

											'error'		:false,
											'result'	:array
										};
										callback(null,ob);

						
									}
									else 
									{
										

										var key = popar.pop();
				
										var redisClient = redis.createClient(redisConfig);
										redisClient.hgetall(key, function (error, result) {
		
											redisClient.quit();
		
											if(error)
											{
											
												Runner(popar,array);
							

											}
											else
											{
		

												/*

												var revresult = {};
												for(var kn in result)
												{
													
													var reply = result[kn];
		
													var buf = Buffer.isBuffer(reply);
													if(buf)
													{
														var str = reply.toString();
														revresult[kn] = str;
													}else{
														revresult[kn] = reply;
													}//==
		
		
												}//==
												*/


												if(result 
												&& result != undefined 
												&& result != null
												)
												{
													array.push(result);	

												}//==

												Runner(popar,array);


			
											}
										
										});


						
									}//if
									//===
							
						
								}//func
								//====
			
								
							}else{


								ob['rex'] = {

									'error'		:'skipped - No reckeys',
									'result'	:[]
								};
								callback(null,ob);

							}//==

						

						}
						else
						{

							
							ob['rex'] = {

								'error'		:'skipped',
								'result'	:[]
							};
							callback(null,ob);


						}//==



					},
					
				

		






	//############################################################################################################
	//############################################################################################################
	//############################################################################################################

	// INSERT

		
					function(ob,callback){ 
		

						if(ob['redis_connect'] == 'ok'
						&& ob['rex']['result'].length == 0
						&& _VARS['recid'] == 'new'
						)
						{

							var popar = [];



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




							var recid = '';


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


							var rec = _VARS['record'];

							var reckey = host+":"+recid+':*';

							popar.push({

								'reckey'	:reckey,
								'rec'		:rec
							});


							
							
							Runner(popar,[]);
							function Runner(popar,array)
							{
							
								if(popar.length == 0
								) 
								{
									console.log("Insert Rec Complete");
							
									ob['redis_insert_rex'] = {
							
										'error'		:false,
										'result'	:array
									};
									callback(null,ob);
							
							
								}
								else 
								{
									
							
									var pob = popar.pop();

									var reckey = pob['reckey'];
									var rec = pob['rec'];

									//console.log("RECKEY: "+reckey+"\nREC: "+rec);
									//return false;
						

									var redisClient = redis.createClient(redisConfig);
									redisClient.hmset(reckey, rec, function (error, result) {
									
										redisClient.quit();
		
						
										if(error)
										{
											console.log(error);
		

											array.push({

												"error"		: error,
												"result"	: result
											});	
											Runner(popar,array);


							
		
										}else{
		
									
				
											//console.log("OTYPE: "+baselib.ObjectType(result));
											//console.log("RESULT: "+result);
		
		
											if(baselib.ObjectType(result) == 'array')
											{
		
												var arr = [];
												result.forEach(function (reply, i) {
		
													var buf = Buffer.isBuffer(reply);
													if(buf)
													{
														var str = reply.toString();
														arr.push(str);
													}else{
														arr.push(reply);
													}//==
		
												});
		
		

												array.push({

													"error"		: false,
													"result"	: arr
												});	
												Runner(popar,array);



											}else{
		

		
												array.push({

													"error"		: false,
													"result"	: result
												});	
												Runner(popar,array);

								
		
											}//==
									
		
										}
					
									});


								}//if
								//===
							
							
							}//func
							//=====

						}
						else
						{

							
							ob['redis_insert_rex'] = {

								'error'		:'skipped',
								'result'	:[]
							};
							callback(null,ob);


						}//==



					
					},







	//############################################################################################################
	//############################################################################################################
	//############################################################################################################

	// UPDATE

		
					function(ob,callback){ 
		

						if(ob['redis_connect'] == 'ok'
						&& ob['rex']['result'].length > 0
						&& _VARS['recid'] != 'new'
						)
						{


							var popar = [];


							var reckey = host+":"+_VARS['recid']+':*';
							var rec = _VARS['record'];

					

							popar.push({

								'reckey'	:reckey,
								'rec'		:rec
							});



							Runner(popar,[]);
							function Runner(popar,array)
							{
							
								if(popar.length == 0
								) 
								{
									console.log("Update Rex Complete");
							
									ob['redis_update_rex'] = {
							
										'error'		:false,
										'result'	:array
									};
									callback(null,ob);
							
							
								}
								else 
								{
									
							
									var pob = popar.pop();

									var reckey = pob['reckey'];
									var rec = pob['rec'];

									if(baselib.ObjectType(rec['data']) == 'object')
									{

										var rdata = rec['data'];
										rec['data'] = JSON.stringify(rdata);

										console.log('conversion');

									}//==

									//console.log("RECKEY: "+reckey+"\nREC: "+rec);
									//return false;
							
						

									var redisClient = redis.createClient(redisConfig);
									redisClient.hmset(reckey, rec, function (error, result) {
									
										redisClient.quit();
		
						
										if(error)
										{
											console.log(error);
		

											array.push({

												"error"		: error,
												"result"	: result
											});	
											Runner(popar,array);


							
		
										}else{
		
									
				
											//console.log("OTYPE: "+baselib.ObjectType(result));
											//console.log("RESULT: "+result);
		
		
											if(baselib.ObjectType(result) == 'array')
											{
		
												var arr = [];
												result.forEach(function (reply, i) {
		
													var buf = Buffer.isBuffer(reply);
													if(buf)
													{
														var str = reply.toString();
														arr.push(str);
													}else{
														arr.push(reply);
													}//==
		
												});
		
		

												array.push({

													"error"		: false,
													"result"	: arr
												});	
												Runner(popar,array);



											}else{
		

		
												array.push({

													"error"		: false,
													"result"	: result
												});	
												Runner(popar,array);

								
		
											}//==
									
		
										}
					
									});


								}//if
								//===
							
							
							}//func
							//=====

						}
						else
						{

							
							ob['redis_update_rex'] = {

								'error'		:'skipped',
								'result'	:[]
							};
							callback(null,ob);


						}//==



					
					},











	//############################################################################################################
	//############################################################################################################
	//############################################################################################################

	// DELKEYS


						

					//========================================================



					//rexkeys - get / verify



					//========================================================
		
					function(ob,callback){ 
		

						if(ob['redis_connect'] == 'ok'
						&& _VARS['recid']
						)
						{

							var recid = _VARS['recid'];


							var cursor = '0';
					
							var pattern = base_domain+":"+recid+':*';
							//var pattern = recid+':*';
							var count = '100';

							ScanRedis(cursor,pattern,count,[],function(array){

								//console.log('Scan Complete');
								//console.log(JSON.stringify(array,null,2));

								//return false;

								ob['delkeys'] = {

									'error'		:false,
									'result'	:array

								};
								callback(null,ob);


							});
			
							function ScanRedis(cursor,pattern,count,array,callback){

								console.log("CURSOR: "+cursor);

								//console.log("PATTERN: "+pattern);

								var redisClient = redis.createClient(redisConfig);
								//redisClient.scan(cursor, 'MATCH',pattern, 'COUNT', 10, function(err, reply){
								redisClient.scan(cursor, 'MATCH',pattern, 'COUNT',count, function(err, reply){


									if(err)
									{

										//array.push(err);

										//count = count - 1;


										var cursor = reply[0];

										
										console.log("ERROR: "+err);
										console.log("REPLY CURSOR: "+reply[0]);
										console.log("REPLY: "+JSON.stringify(reply[1],null,2));


										return ScanRedis(cursor,pattern,count,array,callback);

									}
									else
									{
										

										var cursor = reply[0];

										console.log("REPLY CURSOR: "+reply[0]);
										console.log("REPLY: "+JSON.stringify(reply,null,2));


										/*
										if(!arraylib.InArray(reply[1][0],array))
										{


											array.push(reply[1][0]);


										}//===
										*/
								

										if(cursor === '0'
										)
										{

											var keys = reply[1];
											keys.forEach(function(key,i)
											{   
												
												

												array.push(key);

												/*
												//DELETE
												redisClient.del(key, function(deleteErr, deleteSuccess){

													console.log(key);

												});
												*/

											});

											return callback(array);

										}
										else
										{


											var keys = reply[1];
											keys.forEach(function(key,i)
											{   
												
												

												array.push(key);

												/*
												//DELETE
												redisClient.del(key, function(deleteErr, deleteSuccess){

													console.log(key);

												});
												*/

											});


											return ScanRedis(cursor,pattern,count,array,callback);

										}//==

									}//===

								});


							}//func
							//=====


						}
						else
						{

							
							ob['delkeys'] = {

								'error'		:'skipped',
								'result'	:[]
							};
							callback(null,ob);


						}//==



					},












	//############################################################################################################
	//############################################################################################################
	//############################################################################################################

	// DELETE


						

					//========================================================



					//delete record



					//========================================================
		
					function(ob,callback){ 
		

						if(ob['redis_connect'] == 'ok'
						&& ob['delkeys']['result'].length > 0
						)
						{

							var keys = ob['delkeys']['result'];

							//console.log(keys);
							//return false;

							var popar = [];
							for(var i=0; i < keys.length; i++)
							{

								popar.push(keys[i]);

							}//==


							Runner(popar,[]);
							function Runner(popar,array)
							{

								if(popar.length == 0
								) 
								{
									console.log("DeleteAll Complete");

									ob['delete'] = {

										'error'		:false,
										'result'	:array
									};
									callback(null,ob);

				
								}
								else 
								{
									

									var key = popar.pop();

									var redisClient = redis.createClient(redisConfig);
									redisClient.del(key, function(error, result){

										redisClient.quit();

										//console.log(key);
		
										if(error)
										{

											array.push({

												"key"		:key,
												"error"		:error,
												"result"	:result
											});	

											Runner(popar,array);

										}else{
		

											array.push({

												"key"		:key,
												"error"		:false,
												"result"	:result
											});	

											Runner(popar,array);

										}//==
		
									});
								
					
								}//if
								//===
						
					
							}//func
							//====


						}
						else
						{

							
							ob['delete'] = {

								'error'		:'skipped',
								'result'	:[]
							};
							callback(null,ob);


						}//==



					},





					//======================================================
					//======================================================




					// summary



					
					//======================================================
					//======================================================

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



			);
			//== async
		

		}//== runit


	});//== app post
	

}//== module




