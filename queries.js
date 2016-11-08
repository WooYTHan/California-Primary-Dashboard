var sqlite3 = require("sqlite3");
var censusDB = new sqlite3.Database("census.db");
var pollsDB = new sqlite3.Database("polls.db");
var demVoters  = [110548, 190158, 126739, 113984, 175851, 152810, 139133, 96207, 137785, 109391, 176945, 213197, 254996, 174555, 166820, 114496, 127752, 168333, 141411, 157707, 96898, 98773, 91548, 126929, 138765, 147117, 156738, 186843, 149088, 195793, 123096, 149584, 201383, 148353, 121005, 105253, 245199, 174956, 113792, 149079, 111683, 86941, 208887, 196756, 105196, 106250, 158790, 106771, 104027, 89608, 124064, 123977, 153213];
var districts = [6, 8, 6, 6, 7, 6, 6, 5, 6, 5, 7, 9, 8, 7, 7, 5, 6, 8, 6, 6, 4, 5, 5, 6, 5, 6, 6, 7, 5, 7, 5, 6, 7, 5, 5, 5, 7, 6, 6, 5, 5, 5, 6, 6, 6, 5, 6, 6, 6, 5, 5, 6, 7];
var census = [];
var pollingData = [];
var censusData = [];
var voteResults = [];
var request = require('request');
var title = [];
var date = []; 
var hdata = []; var bdata = [];
 var polllistnew = [];
censusDB.all("SELECT medium,white, african, indian, asian, hawaiian, latino, born, fore, veterans, unemployed, owner, renter, median, household, mean, families, people, high, bachelor FROM Census", function(error, thing)
	{
				if(error) console.log(error);
                census = thing;
           })

function queryServer(request,response,search)
 {
    console.log("query received", search)
    if(search == "?districts=census")
        serveDemVoters(response);
    else if(search == "?districts=voteResults")
    	serveDemVoters2(response);
    else if (search == "?districts=pollster")
    	serveDemVoters3(response);
}

function serveDemVoters(response) 
{  
	 response.writeHead(200, {"Content-Type": "application/json"});
     response.write(JSON.stringify(census));
     response.end(); 
}


function visualizeVoteResults(voteResults) {
    var totalH = 0;
    var totalB = 0;
    var totalHD = 0;
    var totalBD = 0;
    for(var i = 0; i < voteResults.length; i++) 
    {
        var currentReuslts = voteResults[i]
        // instead of console.log here, you should color the map with this information
        console.log("district "+ (i+1) + " has "+ currentReuslts.hVotes+" hillary voters and "+ currentReuslts.bVotes+ " bernie voters");
        
        var hDelegates = Math.round(districts[i]*currentReuslts.hVotes/(currentReuslts.hVotes+currentReuslts.bVotes));
        var bDelegates = districts[i]-hDelegates;
        
        // instead of console.log here you should color the per district delegates here
        console.log(hDelegates+" rewarded to hillary "+bDelegates+" rewarded to bernie");
        
        totalH += currentReuslts.hVotes;
        totalB += currentReuslts.bVotes;
        
        totalHD += hDelegates;
        totalBD += bDelegates;
    }
    
    // now to calculate how the state delegates will get divided
    var stateWideHillaryDelegates = Math.round(158*totalH/(totalH+totalB));
    var stateWideBernieDelegates = 158-stateWideHillaryDelegates;
    
    console.log(stateWideHillaryDelegates+" state wide delegates are awarded to hillary and "+ stateWideBernieDelegates + " are awarded to bernie");
    console.log("overall delegate result: " + stateWideHillaryDelegates+totalHD + " hillary delegates "+ stateWideBernieDelegates+totalBD + " bernie delegates");
}


/////////////////// server code below here

// we're going to use gender as a model here. 
// the output will be an array of how many people voted for hillary 
// and how many people voted for bernie in each district

function go() {
    if(pollingData.length == 0 || censusData.length == 0){
        console.log("still waiting on data");
        return;
    }
    
    console.log("ready to go")
    // first decide for the undecided
    var popIndex = {}
    for(var i = 0; i < pollingData.length; i++) {
        var hill = pollingData[i].hillary/100;
        var bern = pollingData[i].bernie/100;
        var undecided = pollingData[i].undecided/100;
        
        var result = {};
        result.hillary = undecided*(hill/(hill+bern))+hill;
        result.bernie = 1-result.hillary;
        
        popIndex[pollingData[i].population] = result;
    }
    
    // now apply how we think people will vote to each district
    for(var i = 0; i < demVoters.length; i++) {
        var numberOfVoters = demVoters[i]; // for this district
        var numOwnerVoters = censusData[i].owner * numberOfVoters;
        var numRenterVoters = censusData[i].renter * numberOfVoters;
        
        // how many people will vote for bernie
        var hillaryVotes = numOwnerVoters*popIndex.Homeowner.hillary; // 
        hillaryVotes += numRenterVoters*popIndex.Renter.hillary;
        hillaryVotes = Math.round(hillaryVotes);
        
        var bernieVotes = numOwnerVoters*popIndex.Homeowner.bernie; // 
        bernieVotes += numRenterVoters*popIndex.Renter.bernie;
        bernieVotes = Math.round(bernieVotes);
        
        
        voteResults.push({hVotes:hillaryVotes, bVotes:bernieVotes});
    }
    polllistnew.push(voteResults);
    polllistnew.push(censusData);
    function listResponse(body,response) 
    {
      	pollList = JSON.parse(body);
     	 for(var i = 0; i < 3; i++) 
     	 {
        	title.push(pollList[i].pollster);
        	var polldata = pollList[i].last_updated.split("T");
        	date.push(polldata[0]);
      }
      for(var a = 0; a <=2; a++)
      {
            questions = pollList[a].questions;
      		for(var j=0; j<questions.length; j++)
      		{
       			if(questions[j].name == "2016 California Democratic Presidential Primary")
       			{
        		 	pop = questions[j].subpopulations;
        			respons = pop[0].responses;
         			hdata.push(respons[0].value);
         			bdata.push(respons[1].value);
      }
    }
    	}
    data = title.concat(hdata).concat(bdata).concat(date);
    polllistnew.push(data);
    }
    request ("http://elections.huffingtonpost.com/pollster/api/polls.json?page=1&state=CA&after=2016-04-20", function (error, resp, body)
    {
        if (!error && resp.statusCode == 200) {
    	listResponse(body);
        } else {
            console.log("huffpo says error", error);
        }
    });

    
    // at this point you should send this result back to the client so the client
    // can visualize these results. but here i'm just going to print it out to console.
    visualizeVoteResults(voteResults);
}

pollsDB.all("SELECT * FROM Polls WHERE population='Homeowner'\
 OR population='Renter'", 
		function(error, thing) {
            if(error) console.log(error);
            
            pollingData = thing;
            console.log(thing);
            go();
        })
censusDB.all("SELECT owner, renter FROM Census", function(error, thing)
	{
				if(error) console.log(error);
                censusData = thing; 
                console.log(thing);
                go();
           })
function serveDemVoters2(response) 
{  
	 response.writeHead(200, {"Content-Type": "application/json"});
     response.write(JSON.stringify(voteResults));
     console.log(voteResults);
     response.end(); 
} 
 function serveDemVoters3(response) {
        response.writeHead(200, {"Content-Type": "application/json"});
        var voters = JSON.stringify(polllistnew);
        //var datab = JSON.stringify(db);
        response.write(voters);
        //response.write(datab);
        response.end();
    }

       
exports.queryServer = queryServer;

