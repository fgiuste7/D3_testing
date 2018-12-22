
function d3app_first() {
    var data= [30, 86, 168, 281, 303, 365];

    d3.select(".chart")
        .selectAll("div") // no div inside chart, will return empty selection
        .data(data) // Everything after this will excecute once fore each data point
            .enter() // create placeholder for data element
            .append("div") // insert div into placeholder that enter created
            .style("width", function(d) { console.log(`${d}`); return d + "px"; }) // style the new div, set div width equal to data element "d"
            .text(function(d) { return d;}); // add text to div, d is datum
}

function d3app_barplot() {
    var data= [30, 86, 168, 281, 303, 365];
    var scale= d3.scale.linear()
        .domain([0,365]) // input range (xs)
        .range([0,300]) // output range (ys)

    d3.select(".chart")
        .selectAll("div") // no div inside chart, will return empty selection
        .data(data) // Everything after this will excecute once fore each data point
            .enter() // create placeholder for data element
            .append("div") // insert div into placeholder that enter created
            .style("width", function(d) { console.log(`${d}`); return scale(d) + "px"; }) // style the new div, set div width equal to data element "d"
            .text(function(d) { return d;}); // add text to div, d is datum
}

function d3app_text() {
    var dataset = [1, 2, 3, 4, 5];

    d3.select('body')
        .selectAll('p') // select all paragraphs (empty)
        .data(dataset) // puts data into "waiting" state
        .enter() // loop through data
        .append('p') // appends paragraph for each data element
        //.text('D3 is awesome!!'); // for each elemet, put 
        .text(function(d) { return d; });
}

function d3app_svg() {
    var svgWidth = 600, svgHeight = 500;
    var svg = d3.select("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("class", "svg-container")
        
    var line = svg.append("line")
        .attr("x1", 100)
        .attr("x2", 500)
        .attr("y1", 50)
        .attr("y2", 50)
        .attr("stroke", "red")
        .attr("stroke-width", 5);

    var rect = svg.append("rect")
        .attr("x", 100)
        .attr("y", 100)
        .attr("width", 200)
        .attr("height", 100)
        .attr("fill", "#9B95FF");
        
    var circle = svg.append("circle")
        .attr("cx", 200) // center
        .attr("cy", 300)
        .attr("r", 80) // radius
        .attr("fill", "#7CE8D5"); 
}

function d3app_piechart() {
    var data = [
        {"platform": "Android", "percentage": 40.11}, 
        {"platform": "Windows", "percentage": 36.69},
        {"platform": "iOS", "percentage": 13.06}
    ];

    var svgWidth = 500, svgHeight = 300, radius =  Math.min(svgWidth, svgHeight) / 2;
    var svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    //Create group element to hold pie chart    
    var g = svg.append("g") // g is a group element
        .attr("transform", "translate(" + radius + "," + radius + ")") ;

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var pie = d3.pie().value(function(d) { 
        return d.percentage; 
    });

    var path = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);
    
    var arc = g.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g");

    arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) { return color(d.data.percentage); });
            
    var label = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);
                
    arc.append("text")
        .attr("transform", function(d) { 
            return "translate(" + label.centroid(d) + ")"; 
        })
        .attr("text-anchor", "middle")
        .text(function(d) { return d.data.platform+":"+d.data.percentage+"%"; });
}


function d3app_priceChart() {
    //API to fetch historical data of Bitcoin Price Index
    const api = 'https://api.coindesk.com/v1/bpi/historical/close.json?start=2017-12-31&end=2018-04-01';
  
    /**
    * Loading data from API when DOM Content has been loaded'.
    */
    document.addEventListener("DOMContentLoaded", function(event) {
    fetch(api)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            var parsedData = parseData(data);
            drawChart(parsedData);
        })
        .catch(function(err) { console.log(err); })
    });
  
    /**
    * Parse data into key-value pairs
    * @param {object} data Object containing historical data of BPI
    */
    function parseData(data) {
        var arr = [];
        for (var i in data.bpi) {
            arr.push({
                date: new Date(i), //date
                value: +data.bpi[i] //convert string to number
            });
        }
        return arr;
    }
  
    /**
    * Creates a chart using D3
    * @param {object} data Object containing historical data of BPI
    */
    function drawChart(data) {
    var svgWidth = 600, svgHeight = 400;
    var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
  
    var svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);
        
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    var x = d3.scaleTime()
        .rangeRound([0, width]);
  
    var y = d3.scaleLinear()
        .rangeRound([height, 0]);
  
    var line = d3.line()
        .x(function(d) { return x(d.date)})
        .y(function(d) { return y(d.value)})
        x.domain(d3.extent(data, function(d) { return d.date }));
        y.domain(d3.extent(data, function(d) { return d.value }));
  
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();
  
    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)");
  
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    }
  }