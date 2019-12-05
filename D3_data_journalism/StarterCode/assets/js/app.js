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


var svg = d3.select("body").selectAll("scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform",
        `translate(${chartMargin.left}, ${chartMargin.top})`);


// d3.csv("/assets/data/data.csv").then(function (data) {
//     console.log(data);
// });

// // Read CSV File
var csv_data = d3.csv("assets/data/data.csv").then(function (fileData) {
    //Catch any errors from file
    if (error) throw error;

    //Data Parsing
    fileData.forEach(function (data) {

        data.id = +data.id;
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;

        console.log(data);
    });


    // xLinearScale function
    var xLinearScale = xScale(fileData, chosenXAxis)

    //Linear Scale for vertical axis -- based on Health Care High 
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcareHigh)])
        .range([chartHeight, 0]);

    //axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(fileData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".5");

    // Create group for  2 x- axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var stateLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "state") // value to grab for event listener
        .classed("active", true)
        .text("State");

    var healthLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("inactive", true)
        .text("Healthcare");

    // append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Healthcare xyz");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    labelsGroup.selectAll("text")
        .on("click", function () {
            // get the value of clicked selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                chosenXAxis = value;

                //update x scale for new data
                xLinearScale = xScale(csv_data, chosenXAxis);

                // updates x axis
                xAxis = renderAxes(xLinearScale, xAxis);

                //updates circles with new x values
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenXAxis === "healthcare") {
                    stateLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthLabel
                        .classed("active", false)
                        .classed("inactive", true);

                }
                else {
                    stateLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        })



});

// csv_data.catch(function (error) {
//     console.error(error);
// });


// // --------------------------------------------------------------------------- //

// // Horizontal band scale with 10% padding
// var xBandScale = d3.scaleBand()
//     .domain(fileData.map(d => d.state))
//     .range([0, chartWidth])
//     .padding(0.1);

// //Linear Scale for vertical axis -- based on Health Care High 
// var yLinearScale = d3.scaleLinear()
//     .domain([0, d3.max(data, d => d.healthcareHigh)])
//     .range([chartHeight, 0]);



// var leftAxis = d3.axisLeft(yLinearScale).ticks(15);


// //Appended SVG elements to chartGroup area & calling bottom + left axis
// chartGroup.append("g").call(leftAxis);

// chartGroup.append("g")
//     .attr("transform", `translate(0, ${chartHeight})`)
//     .call(bottomAxis);

// // Update x-scale variable after clicking on axis label
// function xScale(data, chosenXaxis) {
//     var xLinearScale = d3.scaleLinear()
//         .domain([d3.min(data), d => d[chosenXaxis] * 0.8,
//         d3.max(data, d => d[chosenXaxis]) * 1.2
//         ])
//         .range([0, width]);
//     return xLinearScale;

// }
// // Function used to update xAxis var after clicking on axis label
// function renderAxis(newXscale, xAxis) {
//     var bottomAxis = d3.bottomAxis(newXscale);

//     xAxis.transition()
//         .duration(800)
//         .call(bottomAxis);

//     return xAxis;
// }

// //function used to update circles with transition to new circles
// function renderCircles(cGroup, newXScale, chosenxAxis) {
//     cGroup.transition()
//         .duration(800)
//         .attr("cx", d => newXScale(d[chosenxAxis]));

//     return cGroup;
// }

// // function used for updating circles group with new tooltip
// function updateToolTip(chosenxAxis, cGroup) {
//     if (chosenxAxis == "State") {
//         var label = "State:"
//     }
//     else {
//         var label = ""
//     }
// }