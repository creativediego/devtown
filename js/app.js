$(document).ready(function() {

    $("#search-city").on("click", function(e) {
        console.log("clicked")

        e.preventDefault();

        var corsProxy = "https://cors-anywhere.herokuapp.com/";
        var slug = $("#city-input").val().trim().replace(" ", "-");
        var url = `${corsProxy}https://api.teleport.org/api/urban_areas/slug:${slug}/salaries/`;



        $.ajax({
            url: url,
            methord: "GET"


        }).then(function(response) {

            console.log("success!")

            let salariesList = response.salaries;

            let webDeveloperObject = salariesList.find(function(element) {
                return element.job.id === "WEB-DEVELOPER"
            });
            console.log(webDeveloperObject)
            $("body").append(`<p>25th percentile: ${Math.round(webDeveloperObject.salary_percentiles.percentile_25)}</p>`)

        });
    })




    var searchOptions = {
        url: "cities.json",
        getValue: "name",
        list: {
            match: {
                enabled: true
            }
        }
    };

    $("#city-input").easyAutocomplete(searchOptions);


});