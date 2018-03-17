var RunApi = Class.create({
    initialize : function(url,searchTerm) {
        this.url = url;
        this.searchTerm = searchTerm;
    },
    run : function(){
        new Ajax.request(this.url, {
            method : 'get',
            onSuccess : processData(),
            onFailure : function() { console.log("something went wrong");}
        });
        //make an ajax call with this.url and this.searchTerm
    },
    processData : function(){
        console.log("ProcessData function");
        //this function will need to be overwritten by child classes
        //because we would be handling different API's differently
    }
});

var CityScoresAPI = Class.create(RunApi,{
    processData : function($super, message){
        $super();
        console.log("Running ProcessData in CityScores API");
    }
});



//sample API call for teleport API https://api.teleport.org/api/urban_areas/slug:pittsburgh/scores/