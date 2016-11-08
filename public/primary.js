var option = ""
var c = document.getElementById("myCanvas");
var max1 = document.getElementById("max");
var min1 = document.getElementById("min");
window.Changed = function()
{
	var x = document.getElementById("select").value;
	if( x == "Total population"){backtogrey();}
	if( x == "Median age (years)"){ option = 'medium';buttonAction(option);}
	if( x == "White"){option = 'white';buttonAction(option);}
	if( x == "Black or African American"){option = 'african';buttonAction(option);}
	if( x == "American Indian and Alaska Native"){option = 'indian';buttonAction(option);}
	if( x == "Asian"){ option = 'asian';buttonAction(option);}
	if( x == "Native Hawaiian and Other Pacific Islander"){option = 'hawaiian';buttonAction(option);}
	if( x == "Hispanic or Latino (of any race)"){option = 'latino';buttonAction(option);}
	if( x == "Born in the United States"){option = 'born';buttonAction(option);}
	if( x == "Foreign born"){ option = 'fore';buttonAction(option);}
	if( x == "Civilian veterans"){option = 'veterans';buttonAction(option);}
	if( x == "Percent Unemployed"){option = 'unemployed';buttonAction(option);}
	if( x == "Owner-occupied"){option = 'owner';buttonAction(option);}
	if( x == "Renter-occupied"){ option = 'renter';buttonAction(option);}
	if( x == "Median (dollars)"){option = 'median';buttonAction(option);}
	if( x == "Median household income (dollars)"){option = 'household';buttonAction(option);}
	if( x == "Mean household income (dollars)"){option = 'mean';buttonAction(option);}
	if( x == "All families"){ option = 'families';buttonAction(option);}
	if( x == "All people"){option = 'people';buttonAction(option);}
	if( x == "Percent high school graduate or higher"){option = 'high';buttonAction(option);}
	if( x == "Percent bachelor's degree or higher"){option = 'bachelor';buttonAction(option);}
}
function pollsterCallback() 
{
  var req2 = new XMLHttpRequest();
  req2.onreadystatechange = function() {
    if(req2.readyState === XMLHttpRequest.DONE) {
      if(req2.status === 200) {
        var resp2 = req2.response;
        callback3(resp2);
      }
    }
  }
  var reqURL = "/query?districts=pollster";
  req2.open('GET', reqURL, true);  // load up the request string
  req2.send(null);
}
function buttonAction(option) 
{
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) { // status 200 means all went well! 
                var resp = req.response;  // response shows up in the object
                callback(resp,option);     // call the callback function
            } else {
                console.log("Problem requesting data from server");
                console.log("Response code ",req.status);
            }
        }
    }
    var reqURL = "/query?districts=census";
    req.open('GET', reqURL, true);  
    req.send(null);    
}

function Model(dems,option) 
{
    this.maxRatio = dems[0][option];
    
    var max = dems[0][option];
    var min = dems[0][option];
    this.minRatio = this.maxRatio;
    this.ratios = [];
    for(var i = 0; i < dems.length; i++) 
    {
        var a = dems[i][option];
        max = Math.max(a,max);
        min = Math.min(a,min);
        
        var r = dems[i][option];        // calculate ratio of registered Democrats to delegates
        this.maxRatio = Math.max(this.maxRatio, r);  // update maxRatio
        this.minRatio = Math.min(this.minRatio, r);  // update minRatio
        this.ratios.push(r);                         // append to ratio list
    }
	c.style.background = "-webkit-linear-gradient(rgb(0,0,255), rgb(187,187,187))";
	max1.innerHTML = Math.round(max * 100) / 100;
	min1.innerHTML = Math.round(min * 100) / 100;
    this.colors = [];
    for(var i = 0; i < dems.length; i++) {
        this.colors.push(this.calculateColor(i));   // for each ratio, calculate gradient color
    }
}

// converts this.ratios[index] to be a value between 0-1
Model.prototype.normalize = function(index) {
    return (this.ratios[index]-this.minRatio)/(this.maxRatio-this.minRatio);
}

// calculate gradient color for a given index
Model.prototype.calculateColor = function(index) {
    var gray = [187,187,187];
    var blue = [0,0,255];
    var norm = this.normalize(index);                // want high ratios to be gray, low ratios to be blue
    //console.log(norm);
    var resultColor = [0,0,0];
    
    for(var i = 0; i < gray.length; i++) {
        // interpolate between gray and blue
        resultColor[i] = Math.round((blue[i]-gray[i])*norm + gray[i] );
        console.log(resultColor[i]);
    }
    return "rgb("+resultColor.join(",")+")";
}

// callback function for our XMLHTTPRequest
function callback(resp,option)
 {
    var dems = JSON.parse(resp);
    //console.log(dems);
    var theModel = new Model(dems,option);
    cleanModel();
    var boxList = d3.selectAll(".delegateBox");
    boxList.style("background-color", function(d,i) {return theModel.colors[i]});
    
    // color the map
    var landList = d3.selectAll("path.land");
    landList.style("fill", function(d,i) {return theModel.colors[d.id-1]});
}

function backtogrey()
{
	
    cleanModel();
	var boxList = d3.selectAll(".delegateBox");
    boxList.style("background-color", "#bbbbbb");
    c.style.background = "white";
    max1.innerHTML = "";
	min1.innerHTML = "";
    var landList = d3.selectAll("path.land");
    landList.style("fill", "#bbbbbb");
}
function cleanModel()
{
	var stateList = d3.selectAll(".stateBox");
    stateList.style("background-color", "#bbbbbb");
   
    var elements = document.getElementsByClassName("topBar");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}
function callback3(resp) {
  content = JSON.parse(resp)[2];
  var row = [];var doc = []; var titlename = [];var bhname = [];
  for ( var i = 1; i <= 5; i++)
  {
  	row[i]= document.createElement("TR");
  }
  for (var i = 1; i <=3; i++)
  {
  	titlename[i]=document.createTextNode(content[i-1] + " " + content[i+8]);
  	bhname[i] = document.createTextNode("Hillary:" + content[i+2] + " " + "Bernie:" + content[i+5]);
  }
  titlename[4] = document.createTextNode("Model Predicts Vote"); 
  bhname[4] = document.createTextNode("Hillary: 52 Bernie: 48");
  titlename[5] = document.createTextNode("Model Predicts Delegates");
  bhname[5] = document.createTextNode("Hillary: 247 Bernie: 228");
 for(var i = 1; i<=10; i++)
 {
 	doc[i] = document.createElement("TD");
 }
  doc[1].appendChild(titlename[1]);
  doc[2].appendChild(bhname[1]);
  doc[3].appendChild(titlename[2]);
  doc[4].appendChild(bhname[2]);
  doc[5].appendChild(titlename[3]);
  doc[6].appendChild(bhname[3]);
  doc[7].appendChild(titlename[4]);
  doc[8].appendChild(bhname[4]);
  doc[9].appendChild(titlename[5]);
  doc[10].appendChild(bhname[5]);
for(var c = 1; c<=5; c++)
{
	row[c].appendChild(doc[c*2-1]);
	row[c].appendChild(doc[c*2]);
	document.getElementById("table").appendChild(row[c]);
}
}

pollsterCallback();