var cityAPI = new CityScoresAPI("San Diego");
cityAPI.run();

var coordinates = new GetCoordinates("San Diego");
var obj = coordinates.run();

//var salariesAPI = new SalariesAPI("San Diego");

//var jobs = new JobsAPI("new york");



var searchOptions = {
    url: "js/cities.json",
    getValue: "name",
    list: {
        match: {
            enabled: true
        }
    }
};



j$("#input-city").easyAutocomplete(searchOptions);