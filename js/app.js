$(document).ready(function() {



    $("#search-city").on("click", function(e) {
        console.log("clicked")

        e.preventDefault();

        var corsProxy = "https://cors-anywhere.herokuapp.com/";
        var slug = $("#city-input").val().trim().replace(" ", "-").toLowerCase();
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
            $("#salary-info").html(`<p>25th percentile: ${numberWithCommas(webDeveloperObject.salary_percentiles.percentile_25)}</p>`)

        });
    })

    const numberWithCommas = (x) => {
        return Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    var searchOptions = {
        url: "js/cities.json",
        getValue: "name",
        list: {
            match: {
                enabled: true
            }
        }
    };

    $("#city-input").easyAutocomplete(searchOptions);


});