function CensusData(array) {
    var totalLines = 271; // 270 lines per district
   
    // first divide array into chunks per district
    this.districts = [];
    
    for(var i = 0; i < array.length; i+= totalLines) {
        var oneDistrict = array.slice(i, i+totalLines);
        
       // var malesLine = oneDistrict[4];      // the number of males is always 4 lines from the start of the district
        //var femalesLine = oneDistrict[5];    // the number of males is always 5 lines from the start of the district
        var total = oneDistrict[3];
		var Median_age = oneDistrict[19]; //years
		var White = oneDistrict[25];
		var African = oneDistrict[26];
		var indian = oneDistrict[27];
		var Asian = oneDistrict[28];
		var Hawaiian = oneDistrict[29];
		var Hispanic = oneDistrict[34];
		var Born = oneDistrict[43];
		var Foreign = oneDistrict[47];
		var veterans = oneDistrict[79];
		var Unemployed = oneDistrict[104];
		var Owner = oneDistrict[155];
		var Renter = oneDistrict[156];
		var Median = oneDistrict[177];//dollars
		var Median_income = oneDistrict[223];//dollars
		var Mean = oneDistrict[224];//dollars
		var families = oneDistrict[234]; //percentage
		var people = oneDistrict[243];//percentage
		var high_school = oneDistrict[269];//percentage
		var bachelor = oneDistrict[270];//percentage
        
        // post process a subset of the information and save it into this.districts
        var keep = [];
        keep[0] = parseInt(total[1].replace(",", ""));
        keep[1] = parseInt(Median_age[1].replace(",", ""));
        keep[2] = parseInt(White[1].replace(",", ""));
        keep[3] = parseInt(African[1].replace(",", ""));
        keep[4] = parseInt(indian[1].replace(",", ""));
        keep[5] = parseInt(Asian[1].replace(",", ""));
        keep[6] = parseInt(Hawaiian[1].replace(",", ""));
        keep[7] = parseInt(Hispanic[1].replace(",", ""));
        keep[8] = parseInt(Born[1].replace(",", ""));
        keep[9] = parseInt(Foreign[1].replace(",", ""));
        keep[10] = parseInt(veterans[1].replace(",", ""));
        keep[11] = parseInt(Unemployed[1].replace(",", ""));
        keep[12] = parseInt(Owner[1].replace(",", ""));
        keep[13] = parseInt(Renter[1].replace(",", ""));
        keep[14] = parseInt(Median[1].replace(",", ""));
        keep[15] = parseInt(Median_income[1].replace(",", ""));
        keep[16] = parseInt(Mean[1].replace(",", ""));
        keep[14] = parseInt(Median[1].replace("$", ""));
        keep[15] = parseInt(Median_income[1].replace("$", ""));
        keep[16] = parseInt(Mean[1].replace("$", ""));
        keep[17] = parseInt(families[1].replace(",", ""));
        keep[18] = parseInt(people[1].replace(",", ""));
        keep[19] = parseInt(high_school[1].replace(",", ""));
        keep[20] = parseInt(bachelor[1].replace(",", ""));
        
        // save the number of males/females as a percentage
        for(var b = 2; b <=11;b++)
        {
        	 keep[b] = keep[b] / keep[0];
        }
        var household = keep[12]+keep[13];
        keep[12] = keep[12]/household;
        keep[13] = keep[13]/household;
        
    
        
        this.districts.push(keep);
    }
}
 
exports.CensusData = CensusData;