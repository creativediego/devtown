var $j = jQuery.noConflict();

var cityAPI = new CityScoresAPI("San Diego");
cityAPI.run();

var coordinates = new GetCoordinates("San Diego");
coordinates.run();

//var salariesAPI = new SalariesAPI("San Diego");

//var jobs = new JobsAPI("new york");

var events = new EventsAPI();
events.run();

var searchOptions = {
    url: "js/cities.json",
    getValue: "name",
    list: {
        match: {
            enabled: true
        }
    }
};



$j("#city-input").easyAutocomplete(searchOptions);