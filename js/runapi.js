/* 
    To use this class hierarchy properly, please include these scripts in your html file

    <script src="https://ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js"></script>
    <script src="js/prototype-cors.js"></script>
    <script src="js/runapi.js"></script>
    <script src="js/app.js"></script>
*/

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
        var obj = {};
        console.log("events length");
        console.log(events.length);
        events.each(function(element) {
            //create a row for each event. and append it to the parent div to hold this table
            console.log(element.name);
            obj["name"] = element.name;
            obj["date"] = element.local_date;
            obj["time"] = element.local_time;
            obj["venue"] = {
                    "name": element.venue.name,
                    "group": element.group.name,
                },
                obj["description"] = element.description;
            obj["link"] = element.link
        });
        console.log(obj);
        return obj;
    },
    runFailed: function() {
        console.log("something went wrong with EventAPI");
    },


});
var CityScoresAPI = Class.create(RunApi, {
    searchTerm: "",
    initialize: function($super, searchTerm) {
        this.searchTerm = searchTerm;
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

        console.log(labels);
        console.log(chartData);




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





        /*
                var ctx = document.getElementById('myLifeStyleChart').getContext('2d');
                var chart = new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'horizontalBar',

                    // The data for our dataset
                    data: {
                        labels: labels,
                        datasets: [{
                            label: "LifeStyle Scores",
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgb(255, 99, 132)',
                            data: chartData,
                        }]
                    },

                    // Configuration options go here
                    options: {}
                });

                this.makeChart();
                */
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

        var salaries = data.responseJSON.salaries;
        var obj = {};
        //get "web developer" salary
        salaries.each(function(element) {
            if (element.job.title === "Web Developer") {
                obj["pct_25"] = Math.round(element.salary_percentiles.percentile_25).toLocaleString();
                obj["pct_50"] = Math.round(element.salary_percentiles.percentile_50).toLocaleString();
                obj["pct_75"] = Math.round(element.salary_percentiles.percentile_75).toLocaleString();
            }
        });

        return obj;
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
        jobs.each(function(job) {
            var j = {};
            j.title = job.title;
            j.location = job.location;
            j.url = job.url;
            j.type = job.type;
            j.company = job.company;
            j.company_url = job.company_url;

            results.push(j);

        });
        console.log(results);
        return results;

        //need to discuss with the team on what data to return from JobsAPI's processData function
    },
    runFailed: function() {
        console.log("something went wrong with JobsAPI");
    }
});