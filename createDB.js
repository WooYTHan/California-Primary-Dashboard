var fs = require("fs");
var parse = require("csv-parse");
var sqlite3 = require("sqlite3");
var cData = require("./CensusData");

var fpDataFile = fs.readFileSync("fieldPoll.csv");
parse(fpDataFile, {comment:'#', relax_column_count:true}, handleFieldPoll);

var cenDataFile = fs.readFileSync("CaliforniaCensus.csv");
parse(cenDataFile, {comment:'#', relax_column_count:true}, handleCensusData);

function dbErrorFunc(error) {
    if(error)console.log(error);
}

function handleFieldPoll(error, array)
 {
    //if(error)console.log(error)
    var db = new sqlite3.Database("polls.db");
    
    db.serialize(function() 
    {
        db.run("CREATE TABLE Polls(population TEXT, hillary INT, bernie INT, undecided INT)", dbErrorFunc);
        
        // for my example i'm just using gender, your model will have to use something different
        // insert males into the database
        for(var a = 0; a <= 36; a++)
        {
        console.log(array[a]); // hard coded line for males
        var cmdStr = "INSERT INTO Polls VALUES('"+array[a][1]+"','"+array[a][2]+"','"+array[a][3]+"','"+array[a][4]+"')";
        //console.log(cmdStr);
        db.run(cmdStr, dbErrorFunc);
        }
        // insert females into the database
        //console.log(array[12]); // hard coded line for females
        //var cmdStr = "INSERT INTO Polls VALUES('"+array[12][1]+"','"+array[12][2]+"','"+array[12][3]+"','"+array[12][4]+"')";
        //console.log(cmdStr);
        //db.run(cmdStr, dbErrorFunc);
        
    }, dbErrorFunc);
}

function handleCensusData(error, array) 
{
    // CensusData takes the array and breaks it up into districts
    // and extracts the demographics that we care about
    var censusData = new cData.CensusData(array);
    //console.log(censusData.districts)
    var db = new sqlite3.Database("census.db");
    
    db.serialize(function()
     {
        db.run( "CREATE TABLE Census(district INT,total INT, medium FLOAT, white INT, african INT, indian INT, asian INT, hawaiian INT, latino INT, born INT, fore INT, veterans INT, unemployed INT, owner INT, renter INT, median INT, household INT, mean INT, families INT, people INT, high INT, bachelor INT)",  dbErrorFunc);
        //console.log(cmdStr);
        
        for(var i = 0; i < censusData.districts.length; i++)
         { // for each district
            var values = [i];
            for(var j = 0; j < censusData.districts[i].length; j++) { // for each demographi we care about
                values.push(censusData.districts[i][j]);
            }
            
            // insert that demographic into the database
            values = "'"+values.join("','")+"'";
            cmdStr = "INSERT INTO Census VALUES ("+values+")";
            console.log(cmdStr);
            db.run(cmdStr, dbErrorFunc);
        }
    }, dbErrorFunc);
}