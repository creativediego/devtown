var RunApi = Class.create({
    corsProxy : "https://cors-anywhere.herokuapp.com/",
    initialize : function(url,searchTerm) {
        this.url = url;
        this.searchTerm = searchTerm;
    },
    
    processData : function(data){
        console.log("ProcessData function");
        console.log(data.responseJSON);
        //this function will need to be overwritten by child classes
        //because we would be handling different API's differently
    },
    run : function(){
        console.log("run function");
        this.url = this.corsProxy + this.url;
        console.log(this.url);
        new Ajax.Request(this.url, {
            method : 'get',
            onSuccess : this.processData,
            onFailure : function() { console.log("something went wrong");}
        });
        //make an ajax call with this.url and this.searchTerm
    },
    concatURL : function() {
        //concat this.url to this.searchTerm
        //funciton needs to be overwritten
        console.log("concatURL function");
    }
});

var CityScoresAPI = Class.create(RunApi,{
    processData : function($super, data){
        $super(data);
        console.log("Running ProcessData in CityScores API");
    }
});



//sample API call for teleport API https://api.teleport.org/api/urban_areas/slug:pittsburgh/scores/