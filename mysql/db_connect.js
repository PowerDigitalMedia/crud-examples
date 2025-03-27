var mysql   = require('mysql');


var sqlConnection = function sqlConnection(db, sql, values, next) {

    //-----------------------------------------------
    //test sql variables
    //-----------------------------------------------
    if(db == undefined) 
    {
        console.log("db variable is undefined");
        var db = 'default-db-name';

    }//==

    //------------------------------------------------
    // It means that the values hasnt been passed
    //------------------------------------------------
    if(arguments.length === 3) 
    {
        next = values;
        values = null;
    }


    //----------------------------------------------------
    //create connection
    //----------------------------------------------------

    var connection = mysql.createConnection({

        host     : "[HOST]",
        user     : "[USER]",
        password : "[PASSWORD]",
        port     : "[PORT]",
        database : db

        //multipleStatements : true

    });
    
    //----------------------------------------------------
    //connect
    //----------------------------------------------------

    //var connection = mysql.createConnection(rds);
    connection.connect(function(err) {

        if(err !== null) 
        {
            console.log("[MYSQL] Error connecting to mysql:" + err+'\n');
        }

    });




    //----------------------------------------------------
    //query
    //----------------------------------------------------

    switch(Object.prototype.toString.call(sql))
    {
    case'[object Object]':


        if(Object.prototype.toString.call(sql) == "[object String]") var parseit = true;
        if(Object.prototype.toString.call(sql) == "[object Array]") var parseit = false;
        if(Object.prototype.toString.call(sql) == "[object Object]") var parseit = false;

        if(parseit)
        {
            if(sql !== undefined || sql !== 'undefined')
            {
                var sql = JSON.parse(sql);
            }
  
        }//==

   
        connection.query(sql, values, function(err) {

            connection.end(); // close the connection
    
            if(err) 
            {
                throw err;
            }
    
            //Execute the callback
            next.apply(this, arguments);
        });

    
    break;
    default:


        connection.query(sql, values, function(err) {

            connection.end(); // close the connection
    
            if(err) 
            {
                throw err;
            }
    
            //Execute the callback
            next.apply(this, arguments);
        });
    
    break;
    }//===




}

module.exports = sqlConnection;


