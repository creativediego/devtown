/*var cityAPI = new CityScoresAPI("San Diego");
cityAPI.run();

var coordinates = new GetCoordinates("San Diego");
var obj = coordinates.run();*/

//var salariesAPI = new SalariesAPI("San Diego");
var input_city;
//var jobs = new JobsAPI("new york");).
j$(document).ready(function() {


    //Search Submit
    j$("#city-submit, #city-submit-nav").on("click", function(event) {
        event.preventDefault();
        console.log("city submit");

        //Empty current info
        j$("#lifestyle").empty();

        //Change input city based on which search button was clicked
        if (j$(this).is("#city-submit")) {
            input_city = j$("#city-input").val().trim();
            console.log(input_city);
        } else if (j$(this).is("#city-submit-nav"))
            input_city = j$("#city-input-nav").val().trim();
        console.log(input_city); {

        }

        //validate input_city
        var cityAPI = new CityScoresAPI(input_city);
        cityAPI.run();

        var coordinates = new GetCoordinates(input_city);
        var obj = coordinates.run();


        //Display nav search
        j$("#nav-search").css("display", "flex")

    });

    //Easy Auto Complete
    var searchOptions = {
        url: "js/cities.json",
        getValue: "name",
        list: {
            match: {
                enabled: true
            }
        }
    };

    j$("#city-input").easyAutocomplete(searchOptions);
    j$("#city-input-nav").easyAutocomplete(searchOptions);
    j$(".easy-autocomplete").css("width", "100%");

    //Shuffle search background pictures
    var imageList = ["sandiegoskyline", "boston_1", "boston_2", "central-park-meadow-nyc", "ny-city", "seattle"]
    var image = imageList[Math.floor(Math.random() * imageList.length)];
    j$("#search-jumbotron").css("background-image", "url(images/" + image + ".jpg)");


    //Data Buttons
    j$("body").on("click", "#lifestyle-data-button", function() {
        j$("#lifestyle-scores").css("display", "flex");
        var cityAPI = new CityScoresAPI(input_city);
        cityAPI.run();
    });

    j$("body").on("click","#jobs-data-button", function(){
        var jobs = new JobsAPI(input_city);
        jobs.run();
    });


});