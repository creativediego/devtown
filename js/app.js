/*var cityAPI = new CityScoresAPI("San Diego");
cityAPI.run();

var coordinates = new GetCoordinates("San Diego");
var obj = coordinates.run();*/

//var salariesAPI = new SalariesAPI("San Diego");

//var jobs = new JobsAPI("new york");).


j$("#city-submit").on("click",function(){
    event.preventDefault();
    console.log("city submit");

    var input_city = j$("#input-city").val().trim();
    console.log(input_city);

    //validate input_city
    var cityAPI = new CityScoresAPI(input_city);
    cityAPI.run();

    var coordinates = new GetCoordinates(input_city);
    var obj = coordinates.run();
    
});


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
