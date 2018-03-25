var RunApi = Class.create({ //abstract parent class
    corsProxy: "https://cors-anywhere.herokuapp.com/",
    url: "",
    initialize: function(searchTerm) {
        this.searchTerm = searchTerm.replace(/\s+/g, '-').toLowerCase();
    },

    makeChart: function() {
        console.log("makeChart virtual function");
        //virtual function, implement it in child classes
    },
    processData: function(data) {
        console.log("ProcessData function");
        //this function will need to be overwritten by child classes
        //because we would be handling data from different API's differently
        //essentially, this function is a pure virtual function 
    },
    run: function() {
        this.url = this.corsProxy + this.url;
        console.log(this.url);
        new Ajax.Request(this.url, {
            method: 'get',
            onSuccess: this.processData,
            onFailure: this.runFailed
        });
        //make an ajax call with this.url and this.searchTerm
    },
    runFailed: function() {
        console.log("something went wrong");
    }
});


var GetCoordinates = Class.create(RunApi, {
    initialize: function($super, searchTerm) {
        $super(searchTerm);
        this.url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + this.searchTerm + "&key=AIzaSyB_nD6SoMGerwmAR7yFzj0csEUO63kxvpk";
    },
    processData: function($super, data) {
        console.log("Running coordinates processData");
        console.log(data.responseJSON.results[0].geometry.location);
        var obj = {};
        obj["longitude"] = data.responseJSON.results[0].geometry.location.lng;
        obj["latitude"] = data.responseJSON.results[0].geometry.location.lat;

        var events = new EventsAPI(obj["latitude"], obj["longitude"]);
        events.run();

        console.log(obj);
        return obj;
    },
    runFailed: function() {
        console.log("something went wrong with GetCoordinates");
    },
});

var EventsAPI = Class.create(RunApi, {

    initialize: function($super, lat, long) {

        this.url = "https://api.meetup.com/find/upcoming_events?photo-host=public&page=20&text=javascript&sig_id=250431359&order=time&lon=" + long + "&lat=" + lat + "&sig=e5feea709554a29a9ad1908e25d4e43a7c142add";
    },
    processData: function($super, data) {
        var events = data.responseJSON.events;
        console.log("events API processData function");
        console.log(events);
        var obj = [];
        console.log("events length");
        console.log(events.length);

        obj = events.map(function(element) {


            return {
                "name": element.name,
                "date": element.local_date,
                "time": element.local_time,
                "groupName": element.group.name,
                "description": element.description,
                "link": element.link
            }


        });

        console.log("CUSTOM OBJECT: ", obj)
    },
    runFailed: function() {
        console.log("something went wrong with EventAPI");
    },


});
var CityScoresAPI = Class.create(RunApi, {
    searchTerm: "",
    initialize: function($super, searchTerm) {
        this.searchTerm = searchTerm;
        //right now i only see this issue with san francisco. 
        //We probably should move it to a function/method it handle this on a more general level.

        if (searchTerm.toLowerCase() === "san francisco") {
            searchTerm = "san francisco bay area";
        }
        console.log("search term: " + searchTerm);
        $super(searchTerm);
        this.url = "https://api.teleport.org/api/urban_areas/slug:" + this.searchTerm + "/scores/";
    },
    processData: function($super, data) {
        console.log("Running ProcessData in CityScores API");

        var scores = data.responseJSON.categories;
        var obj = {};
        var labels = [];
        var chartData = [];
        scores.each(function(element) {
            obj[element.name] = Math.round(element.score_out_of_10);
            labels.push(element.name);
            chartData.push(Math.round(element.score_out_of_10));

        });

        //Build score divs and append to card 
        function buildLifeStyle() {
            //Build data card
            buildCard("lifestyle-scores");

            //Build lifestyle data for the card
            let cardDataContainer = j$(`<div class="row">`);

            for (let i = 0; i < labels.length; i++) {
                let divCol = j$('<div class="col-sm-6">');
                let label = j$(`<p class="score-label">${labels[i]}</p>`)
                let progressDiv = j$('<div class="progress">')
                let progressBarDiv = j$(`<div class="progress-bar bg-info" role="progressbar" style="width: ${chartData[i]}0%" aria-valuenow="${chartData[i]}" aria-valuemin="0" aria-valuemax="10">${chartData[i]}/10</div>`)
                progressDiv.append(progressBarDiv);
                divCol.append(label).append(progressDiv);

                //Keep storing each score div to this row
                cardDataContainer.append(divCol);
            }

            j$("#lifestyle-scores").html(cardDataContainer);

            //Set page location to anchor
            let anchor = `<a class="anchor" id="data-anchor"></a>`
            j$("#data").prepend(anchor);
            location.href = "#data-anchor"
        }

        buildLifeStyle();
    },
    runFailed: function() {
        console.log("something went wrong with CityScoresAPI");
    },
});

var SalariesAPI = Class.create(RunApi, {
    initialize: function($super, searchTerm) {
        $super(searchTerm);
        this.url = "https://api.teleport.org/api/urban_areas/slug:" + this.searchTerm + "/salaries/";
    },
    processData: function($super, data) {
        //$super(data);
        console.log("Running ProcessData in Salaries API");

        //Build data card
        buildCard("salary-data");

        //Build lifestyle data for the card
        let cardDataContainer = j$(`<div class="row">`);

        var salaries = data.responseJSON.salaries;
        var obj = {};

        var label = [];
        var salaryData = [];
        //get "web developer" salary
        salaries.each(function(element) {
            if (element.job.title === "Web Developer") {
                label.push("25th Percentile");
                salaryData.push(Math.round(element.salary_percentiles.percentile_25).toLocaleString());

                label.push("50th Percentile");
                salaryData.push(Math.round(element.salary_percentiles.percentile_50).toLocaleString());

                label.push("75th Percentile");
                salaryData.push(Math.round(element.salary_percentiles.percentile_75).toLocaleString());

                obj["pct_25"] = Math.round(element.salary_percentiles.percentile_25).toLocaleString();
                obj["pct_50"] = Math.round(element.salary_percentiles.percentile_50).toLocaleString();
                obj["pct_75"] = Math.round(element.salary_percentiles.percentile_75).toLocaleString();
            }
        });
        

        console.log(label); console.log(salaryData);

        //need help with making the salary data show up in the chart. 

        var ctx = document.getElementById('myLifeStyleChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'horizontalBar',

            // The data for our dataset
            data: {
                labels: label,
                datasets: [{
                    label: "Average Salary Data",
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: salaryData,
                }]
            },

            // Configuration options go here
            options: {}
        });

        this.makeChart();
        //buildCard("salary-data");
        //let cardDataContainer = j$(`<div class="row">`);
        /*
        for (let i = 0; i < label.length; i++) {
            let divCol = j$('<div class="col-sm-6">');
            let label = j$(`<p class="score-label">${label[i]}</p>`)
            let progressDiv = j$('<div class="progress">')
            let progressBarDiv = j$(`<div class="progress-bar bg-info" role="progressbar" style="width: ${salaryData[i]}0%" aria-valuenow="${chartData[i]}" aria-valuemin="0" aria-valuemax="10">${chartData[i]}/10</div>`)
            progressDiv.append(progressBarDiv);
            divCol.append(label).append(progressDiv);

            //Keep storing each score div to this row
            cardDataContainer.append(divCol);
        }

        j$("#salary-data").html(cardDataContainer);

        //Set page location to anchor
        let anchor = `<a class="anchor" id="data-anchor"></a>`
        j$("#data").prepend(anchor);
        location.href = "#data-anchor";

        //Finish building card with all scores and append it to DOM
        cardBody.append(cardBodyRow);
        card.append(cardHeader).append(cardBody);
        j$("#data").html(card);*/

    },
    runFailed: function() {
        console.log("something went wrong with SalariesAPI");
    }
});

var JobsAPI = Class.create(RunApi, {
    initialize: function($super, searchTerm) {
        $super(searchTerm);
        this.url = "https://jobs.github.com/positions.json?";
        this.description = "description=web+development" + "&";
        this.searchTerm = "location=" + this.searchTerm + "&";
        this.url += this.description + this.searchTerm;
    },
    processData: function(data) {
        console.log("Running ProcessData in JobsAPI")
        var jobs = data.responseJSON;

        var results = [];

        //Build data card
        buildCard("job-listings");

        //Build lifestyle data for the card
        let cardDataContainer = j$(`<div class="row">`);

        //create table header here;
        var table = j$(`<table class="table">`);
        var thead = j$(`<thead>`);
        var tr = j$(`<tr class="font-weight-bold">`);
        var title_header = j$(`<th scope="col">`).text("Title");
        var location_header = j$(`<th scope="col">`).text("Location");
        var company_header = j$(`<th scope="col">`).text("Company/Employer");
        var type_header = j$(`<th scope="col">`).text("Job Type");
        tr.append(title_header).append(location_header).append(company_header).append(type_header);
        table.append(thead).append(tr);

        var tbody = j$(`<tbody id="jobs-data">`);

        jobs.each(function(job) {

            var row = j$(`<tr>`);
            var title = j$(`<th>`);
            var title_link = j$(`<a>`);
            title_link.text(job.title);
            title_link.attr("href", job.url);
            title_link.attr("target", "_blank");
            title.append(title_link);
            var location = j$(`<th>`).text(job.location);
            var company = j$(`<th>`);
            var company_url = j$(`<a>`);
            company_url.text(job.company);
            company_url.attr("href", job.company_url);
            company_url.attr("target", "_blank");
            company.append(company_url);
            company.attr("href", job.company_url);
            var type = j$(`<th>`).text(job.type);
            row.append(title).append(location).append(company).append(type);
            tbody.append(row);

            var j = {};
            j.title = job.title;
            j.location = job.location;
            j.url = job.url;
            j.type = job.type;
            j.company = job.company;
            j.company_url = job.company_url;

            results.push(j);

        });

        table.append(tbody);
        cardDataContainer.append(table);

        j$("#job-listings").html(cardDataContainer);

        console.log(results);

        //Finish building card with all scores and append it to DOM
        cardBody.append(cardBodyRow);
        card.append(cardHeader).append(cardBody);
        j$("#data").html(card);


        return results;

        //need to discuss with the team on what data to return from JobsAPI's processData function
    },
    runFailed: function() {
        console.log("something went wrong with JobsAPI");
    }
});