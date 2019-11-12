// @TODO: YOUR CODE HERE!

//SVG dimensions
var svgWidth = 960;
var svgHeight = 660;

//chart margins
var chartMargin = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40
}

// dimensions of chart area
var charWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;


var svg = d3.select("body")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform",
        `translate(${chartMargin.left}, ${chartMargin.top})`);


// Read CSV File
d3.csv("data.csv", function (error, csv_data) {
    if (error) throw error;
    console.log(csv_data);
});

csv_data.foreach(function (d) {
    d.id = +d.id;
    d.poverty = +d.poverty;
    d.povertyMoe = +d.povertyMoe;
    d.age = +d.age;
    d.ageMoe = +ageMoe;
    d.income = +d.income;
    d.incomeMoe = +d.incomeMoe;
    d.healthcare = +d.healthcare;
    d.healthcareLow = +d.healthcareLow;
    d.healthcareHigh = +d.healthcareHigh;
    d.obesity = +d.obesity;
    d.obesityLow = + d.obesityLow;
    d.obesityHigh = +d.obesityHigh;
    d.smokes = + d.smokes;
    d.smokesLow = +d.smokesLow;
    d.smokesHigh = +d.smokesHigh;

})

// Horizontal band scale with 10% padding
var xBandScale = d3.scaleBand()
    .domain(csv_data.map(d => d.state))
    .range([0, chartWidth])
    .padding(0.1);

//Linear Scale for vertical axis -- based on Health Care High 
var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(csv_data, d => d.healthcareHigh)])
    .range([chartHeight, 0]);

//axis functions
var bottomAxis = d3.axisBottom(xBandScale);
var leftAxis = d3.axisLeft(yLinearScale).ticks(15);

//Appended SVG elements to chartGroup area & calling bottom + left axis
chartGroup.append("g").call(leftAxis);

chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

