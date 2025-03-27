require('dotenv').config();
const async = require('async');
const fs = require('fs');
const path = require('path');
const nodedir = require('node-dir');


const AWS = require('aws-sdk');
const { DH_CHECK_P_NOT_SAFE_PRIME, SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } = require('constants');

const s3 = new AWS.S3()
//AWS.config.update({accessKeyId: 'id-omitted', secretAccessKey: 'key-omitted'})

// Tried with and without this. Since s3 is not region-specific, I don't
// think it should be necessary.
// AWS.config.update({region: 'us-west-2'})

const dynamodb = new AWS.DynamoDB({region:process.env.DYNAMODB_REGION});
const docClient = new AWS.DynamoDB.DocumentClient({region:process.env.DYNAMODB_REGION});


module.exports=function(app)
{

	app.post('/process-crud-dynamodb',function(req,res){


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

		
				
							var table = 'records';

				
							//====================================
							//partkey / sortkey
							//====================================

							var partkey = "unique-partition-key";	
							var sortkey = "sortby-key";
					
							
		
							//====================================
							//names and values
							//====================================
		
							var qrNames = {
				
								"#partkey"  : "mypart",
								"#sortkey"  : "mysort",
		
								"#recid"	: "recid"
							};
		
		
							var qrObj = {
				
								":partkey"  : partkey,
								":sortkey"  : sortkey,
		
								":recid"	: "1234",
			
							};
		
		
							//====================================
							//condition statement
							//====================================
					
							var condexp = "#partkey = :partkey and begins_with(#sortkey, :sortkey)"
		
		
							//====================================
							//filter statement
							//====================================
		
							var filtexp = "";
							filtexp += "#recid = :recid";
				
		
							//====================================
							//build params
							//====================================
		
							var params = {
		
								TableName : table,
		
								ExpressionAttributeNames : qrNames,
								ExpressionAttributeValues : qrObj,
		
								KeyConditionExpression: condexp,
								FilterExpression: filtexp
		
							};	
		
		
							//console.log(JSON.stringify(params,null,2));
		
										
							//====================================
							//query
							//====================================
		
							docClient.query(params, function(err, data) {
		
								if(err) 
								{
									console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
		
									ob['select_error'] = err;
									ob['select_result'] = [];
									callback(null,ob);
		
								} 
								else 
								{
									//console.log("Query succeeded.");
		
									//----------------------------------------
		
						
									var rows = [];
									if(data.Items.length > 0)
									{
										data.Items.forEach(function(itm) {
		
											//console.log("ITEM: "+JSON.stringify(itm,null,2));
											if(itm 
											&& itm != undefined 
											&& Object.keys(itm).length > 0
											)
											{
												rows.push(itm);
											}
										
										});
		
									
		
									}
									else
									{
		
										console.log("No Records Found");
								
									}
									
									//----------------------------------------
		
									//console.log("RECORDS COUNT: "+data.Items.length)
		
									ob['select_error'] = false;
									ob['select_result'] = rows;

									callback(null,ob);
		
		
								}
		
		
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
				
					
		

							var table = 'records';

		
							//====================================
							//partkey / sortkey
							//====================================
							
							var partkey = "unique-partition-key";	
							var sortkey = "sortby_key";
	

					
	
							//====================================
							//build variables
							//====================================
	
							var recid 	= _VARS['recid'];

							var name 	= _VARS['name'];
							var email 	= _VARS['email'];
							var phone 	= _VARS['phone'];
							var address = _VARS['address'];
							var city 	= _VARS['city'];
							var state 	= _VARS['state'];
							var country = _VARS['country'];
							var zipcode = _VARS['zipcode'];
			

				
							//====================================
							//build items params
							//====================================
	
							var params = {
		
								TableName:table,
								Item:{
									
									"siteuser"  :partkey,
									"reckey"    :sortkey,
	
									"recid"     :recid,

									"name"      :name,
									"email"     :email,
									"phone"  	:phone,
									"address"   :address,
									"city"  	:city,
									"state"   	:state,
									"country"	:country,
									"zipcode"	:zipcode
	
								}
							
							};
	
	
							//====================================
							//execute
							//====================================
	
							console.log("Adding a new item...");
							docClient.put(params, function(err, data) {
			
			
								if(err) 
								{
									console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
		
									ob['insert_result'] = err;
									ob['insert_error'] = true;
								
									callback(err,ob);
	
								} 
								else 
								{
									console.log("Added item:", JSON.stringify(data, null, 2));
			
									ob['insert_result'] = data;
									ob['insert_error'] = false;
								
									callback(null,ob);
			
								}
			
		
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
				
			


							var table = 'records';


							var recid 			= _VARS['recid'];
							var name 			= _VARS['name'];
							var email 			= _VARS['email'];		
							var phone 			= _VARS['phone'];
							var address 		= _VARS['address'];
							var city 			= _VARS['city'];
							var state  			= _VARS['state'];
							var country 		= _VARS['country'];
							var zipcode 		= _VARS['zipcode'];




			
							//====================================
							//partkey / sortkey
							//====================================
							
							var partkey = "unique-partition-key";	
							var sortkey = "sortby-key";
					
					
			
							//====================================
							//names and values
							//====================================
			
							var expNames = {
				
								"#partkey"  : "mypart",
								"#sortkey"  : "mysort",
			
								"#recid"	: "recid",

								"#name"		: "name",
								"#email"	: "email",
								"#phone"	: "phone",
								"#address"	: "address",
								"#city"		: "city",
								"#state"	: "state",
								"#country"	: "country",
								"#zipcode"	: "zipcode"


							};
			
			
							var expObj = {
				
								":partkey"  : partkey,
								":sortkey"  : sortkey,
			
								":recid"	: recid,
							
								":name"		: name,
								":email"	: email,
								":phone"	: phone,
								":address"	: address,
								":city"		: city,
								":state"	: state,
								":country"	: country,
								":zipcode"	: zipcode

			
							};
			


							//====================================
							//statement
							//====================================
			
							var expStatement = "set ";
							expStatement = "#recid = :recid";
							expStatement = ", #name = :name";
							expStatement = ", #email = :email";
							expStatement = ", #phone = :phone";
							expStatement = ", #address = :address";
							expStatement = ", #city = :city";
							expStatement = ", #state = :state";
							expStatement = ", #country = :country";
							expStatement = ", #zipcode = :zipcode";



							
							//====================================
							//params
							//====================================
		
							var params = {

								TableName:table,

								Key:{
									"siteuser"	: partkey,
									"reckey"	: sortkey
								},

								ExpressionAttributeNames : expNames,
								ExpressionAttributeValues : expObj,
			
								UpdateExpression : expStatement,

								ReturnValues:"UPDATED_NEW"

							};


							//====================================================
							//execute
							//====================================================
	
							//console.log("Updating the item...");
							docClient.update(params, function(err, data) {


								if(err) 
								{
									console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));

									ob['update_error'] = err;
									ob['update_result'] = [];

									callback(null, ob);



								} 
								else 
								{
									console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));

									ob['update_error'] = false;
									ob['update_result'] = data;

									callback(null, ob);

								
								}


								
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
					


							var table = 'records';

							//====================================
							//partkey / sortkey
							//====================================
							
							var partkey = "unique-partition-key";	
							var sortkey = "sortby-key";
					
				
							//====================================
							//params
							//====================================
							
							var params = {


								"TableName":table,
								"Key":{

									"mypart"	:partkey,
									"mysort"	:sortkey

								}



							};

							//====================================
							// execute
							//====================================
	
							console.log("Attempting a conditional delete...");
							docClient.delete(params, function(err, data) {


								if(err) 
								{
								
									console.error("Delete Error:", JSON.stringify(err, null, 2));
		
	
									ob['delete_error'] = err;
									ob['delete_result'] = [];

									callback(null, ob);
			
								}
								else 
								{
									
									console.log("Deleted item. Item description JSON:", JSON.stringify(data, null, 2));
		
									ob['delete_error'] = false;
									ob['delete_result'] = data;

									callback(null, ob);
								

								}//==
							

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




