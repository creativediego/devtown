/*var cityAPI = new CityScoresAPI("San Diego");
cityAPI.run();

var coordinates = new GetCoordinates("San Diego");
var obj = coordinates.run();*/

//var salariesAPI = new SalariesAPI("San Diego");
var inputCity;
//var jobs = new JobsAPI("new york");).
j$(document).ready(function() {

    var inputCity;

    makeAPICall = function() {
        //validate inputCity
        var cityAPI = new CityScoresAPI(inputCity);
        cityAPI.run();

        //Display nav search
        j$("#nav-search").css("display", "flex")

    }

    //Build Card
    buildCard = function(id) {
        let card = j$('<div class="card" id="data-card">');
        let cardHeader = j$(`<div class="card-header lead text-center" id="data-header"><h2 style="font-size: 3rem">${inputCity}</h2></div>`);
        let cardBody = j$(`<div class="card-body" id="${id}">`);

        lifestyleButton = j$(`<span><button type="button" id="lifestyle-data-button" class="btn btn-outline-info active">LifeStyle</button> </span>`);
        jobsButton = j$(`<span><button type="button" id="jobs-data-button" class="btn btn-outline-info active">Jobs</button> </span>`);
        salariesButton = j$(`<span><button type="button" id="salaries-data-button" class="btn btn-outline-info active">Salaries</button> </span>`);
        eventsButton = j$(`<span><button type="button" id="events-data-button" class="btn btn-outline-info active">Events</button> </span>`);

        cardHeader.append(lifestyleButton).append(jobsButton).append(salariesButton).append(eventsButton);
        //cardBody.append(cardBodyRow)
        //cardBody.append(cardBodyRow);
        card.append(cardHeader).append(cardBody);
        j$("#data").html(card);

    }

    //Search Submit
    j$("#city-submit, #city-submit-nav").on("click", function(event) {
        event.preventDefault();
        console.log("city submit");

        //Empty current info
        j$("#data, #status, #nav-status").empty();


        if (j$(this).is("#city-submit")) {
            inputCity = j$("#city-input").val().trim();

            if (inputCity === "") {

                j$("#status").append(`<p class="alert alert-warning mt-3 text-center">Enter a city.</p>`);

            } else {

                j$("#city-input-nav").attr("placeholder", inputCity);
                j$("#city-input").attr("placeholder", inputCity);
                j$("#city-input").val('');
                makeAPICall();

            }


        } else if (j$(this).is("#city-submit-nav")) {
            inputCity = j$("#city-input-nav").val().trim();


            if (inputCity === "") {

                j$("#nav-status").append(`<p class="alert alert-warning mt-3 text-center">Enter a city.</p>`);

            } else {

                j$("#city-input").attr("placeholder", inputCity);
                j$("#city-input-nav").attr("placeholder", inputCity);
                j$("#city-input-nav").val('');
                makeAPICall();

            }

        }



    });

    //Take a dynamic data button, and make an API call. This for after the initial search
    function fetchDataButtons(id) {
        j$("body").on("click", id, function() {
            console.log(id);

            let fetchData = {
                "#lifestyle-data-button": function() {

                    let cityAPI = new CityScoresAPI(inputCity);
                    cityAPI.run();

                },

                "#jobs-data-button": function() {

                    var jobs = new JobsAPI(inputCity);
                    jobs.run();
                    //j$("#data-card").html("JOBS DATA HERE");

                },

                "#salaries-data-button": function() {
                    var salaries = new SalariesAPI(inputCity);
                    salaries.run();
                },

                "#events-data-button": function() {
                    var MeetUp = new GetCoordinates(inputCity);
                    MeetUp.run();

                }
            }

            fetchData[id]();


        });
    }

    fetchDataButtons("#lifestyle-data-button");
    fetchDataButtons("#jobs-data-button");
    fetchDataButtons("#salaries-data-button");
    fetchDataButtons("#events-data-button");

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


});