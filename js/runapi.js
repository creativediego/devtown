var RunApi = Class.create({ //abstract parent class
    corsProxy : "https://cors-anywhere.herokuapp.com/",
    url : "",
    initialize : function(searchTerm) {
        this.searchTerm = searchTerm.replace(/\s+/g, '-').toLowerCase();
    },
    
    processData : function(data){
        console.log("ProcessData function");
        //this function will need to be overwritten by child classes
        //because we would be handling data from different API's differently
        //essentially, this function is a pure virtual function 
    },
    run : function(){
        console.log("run function");
        this.url = this.corsProxy + this.url;
        console.log(this.url);
        new Ajax.Request(this.url, {
            method : 'get',
            onSuccess : this.processData,
            onFailure : function() { console.log("something went wrong");}
        });
        //make an ajax call with this.url and this.searchTerm
    },
    makeChart : function() {
        //virtual function, implement it in child classes
    }
});

var CityScoresAPI = Class.create(RunApi,{
    initialize : function($super,searchTerm){
        $super(searchTerm);     
        this.url = "https://api.teleport.org/api/urban_areas/slug:"+this.searchTerm+"/scores/";
    },
    processData : function($super, data){
        console.log("Running ProcessData in CityScores API");
        
        var scores = data.responseJSON.categories;
        var obj = {};
        var labels = [];
        var chartData = [];
        scores.each(function(element){
            obj[element.name] = Math.round(element.score_out_of_10);
            labels.push(element.name);
            chartData.push(element.score_out_of_10);
            
        });
        console.log(obj);
        makeChart(labels,chartData);
        return obj;
    },
    makeChart : function(labels,chartData){
        //make chart object and update the chart div on html
    }
});

var SalariesAPI = Class.create(RunApi,{
    initialize : function($super,searchTerm){
        $super(searchTerm);
        this.url = "https://api.teleport.org/api/urban_areas/slug:"+this.searchTerm+"/salaries/";
    },
    processData : function($super, data){
        //$super(data);
        console.log("Running ProcessData in Salaries API");
        
        var salaries = data.responseJSON.salaries;
        var obj = {};
        //get "web developer" salary
        salaries.each(function(element){
            if(element.job.title === "Web Developer"){
                obj["pct_25"] = Math.round(element.salary_percentiles.percentile_25).toLocaleString();
                obj["pct_50"] = Math.round(element.salary_percentiles.percentile_50).toLocaleString();
                obj["pct_75"] = Math.round(element.salary_percentiles.percentile_75).toLocaleString();
            }
        });

        return obj;
    }
});

var JobsAPI = Class.create(RunApi,{
    initialize : function($super,searchTerm){
        $super(searchTerm);
        this.url = "https://jobs.github.com/positions.json?";
        this.description = "description=web+development" + "&";
        this.searchTerm = "location="+this.searchTerm+"&";
        this.url += this.description + this.searchTerm;
    },
    processData : function(data){
        console.log("Running ProcessData in JobsAPI")
        var jobs = data.responseJSON;

        var results = [];
        jobs.each(function(job){
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
    }
});
