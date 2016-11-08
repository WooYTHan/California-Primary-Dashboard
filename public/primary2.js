
function buttonloadModel() 
{
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) { // status 200 means all went well! 
                var resp = req.response;  // response shows up in the object
                callback2(resp);     // call the callback function
            } else {
                console.log("Problem requesting data from server");
                console.log("Response code ",req.status);
            }
        }
    }
    var reqURL = "/query?districts=voteResults";
    req.open('GET', reqURL, true);  
    req.send(null);    
}

function loadModel(dems) 
{
    var c = document.getElementById("myCanvas");
    var max1 = document.getElementById("max");
    var min1 = document.getElementById("min");
    this.maxRatio = dems[0].hVotes/(dems[0].hVotes+dems[0].bVotes);
    var max = dems[0].hVotes/(dems[0].hVotes+dems[0].bVotes);
    var min = max;
    this.minRatio = this.maxRatio;
    this.ratios = [];
    for(var i = 0; i < dems.length; i++) 
    {
        var a = dems[i].hVotes/(dems[i].hVotes+dems[i].bVotes);
        max = Math.max(a,max);
        min = Math.min(a,min);
        var r = dems[i].hVotes/(dems[i].hVotes+dems[i].bVotes);        // calculate ratio of registered Democrats to delegates
        this.maxRatio = Math.max(this.maxRatio, r);  // update maxRatio
        this.minRatio = Math.min(this.minRatio, r);  // update minRatio
        this.ratios.push(r);                         // append to ratio list
    }
    c.style.background = "-webkit-linear-gradient(rgb(255,0,0),rgb(0,0,255))";
	max1.innerHTML = Math.round(max * 100) / 100;
	min1.innerHTML = Math.round(min * 100) / 100;
    this.colors = [];
    for(var i = 0; i < dems.length; i++) {
        this.colors.push(this.calculateColor(i));   // for each ratio, calculate gradient color
    }
}

// converts this.ratios[index] to be a value between 0-1
loadModel.prototype.normalize = function(index) {
    return (this.ratios[index]-this.minRatio)/(this.maxRatio-this.minRatio);
}

// calculate gradient color for a given index
loadModel.prototype.calculateColor = function(index) {
    var red = [255,0,0];       //hill red
    var blue = [0,0,255];     //b blue
    var norm = this.normalize(index);                // want high ratios to be gray, low ratios to be blue
    //console.log(norm);
    var resultColor = [0,0,0];
    
    for(var i = 0; i < red.length; i++) {
        // interpolate between gray and blue
        resultColor[i] = Math.round((red[i]-blue[i])*norm + blue[i] );
        console.log(resultColor[i]);
    }
    return "rgb("+resultColor.join(",")+")";
}

// callback function for our XMLHTTPRequest
function callback2(resp)
 {
    var voters = JSON.parse(resp);
    console.log(voters);
    var theloadModel = new loadModel(voters);
    var totalbnum = 0;
    console.log(totalbnum);
    var totalhnum = 0;
    console.log(totalhnum);
    
    for(var i = 0; i < voters.length; i++)
    {
    	totalbnum +=voters[i].bVotes;
    	totalhnum += voters[i].hVotes;
    	
    }
    
    var totalnum = totalbnum + totalhnum;
    console.log(totalnum);
    for(var i = 0; i < voters.length; i++)
    {
        totalper = voters[i].bVotes+voters[i].hVotes;
    	bper =voters[i].bVotes/totalper*100;
    	hper = voters[i].hVotes/totalper*100;
        console.log("Distrct  "+i+" Hillary  "+Math.round(hper)+" Bernie  "+Math.round(bper));
    	
    }
    var bvoterper = (totalbnum/totalnum)*158;
   
    bvoterper = Math.round(bvoterper);
     console.log(bvoterper);
    var hvoterper = 158-bvoterper;
    var bvoterdisper = totalbnum/totalnum;
  for( var i = 1; i <= bvoterper; i++)
   {
   		var array = ".stateBox.state"+i;
    	var state = d3.select(array);
    	state.style("background-color","blue");
    }
    for( var i = bvoterper+1 ; i <= 158; i++)
   {
   		var array = ".stateBox.state"+i;
    	var state = d3.select(array);
    	state.style("background-color","red");
    }
    var elements = document.getElementsByClassName("topBar");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
	var insideDivs = outsideDivs.append("div");
	insideDivs.attr("class", function(d,i) {return "topBar dist"+(i+1)});
	insideDivs.style("height", function(d) {return (d*5*bvoterdisper)+"px"});
	insideDivs.attr("title",function(d,i) {return i+1;});
	//outsideDivs.remove("div");
	//var InDiv = OutDiv.append("div").attr("class","topBar");
    // color the delegate boxes
    var boxList = d3.selectAll(".delegateBox");
    boxList.style("background-color", "red");
    
    // color the map
    var landList = d3.selectAll("path.land");
    landList.style("fill", function(d,i) {return theloadModel.colors[d.id-1]});
    
}
