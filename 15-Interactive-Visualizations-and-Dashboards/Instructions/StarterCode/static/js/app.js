//d3.json("static/data/samples.json").then(function(data) {
//console.log(data);
//});

$(document).ready(function() {
    getidFilter();
});

function getidFilter() {
    $.ajax({
        type: 'GET',
        url: "static/data/samples.json",
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            //console.log(data);
            data["names"].forEach(function(id) {
                let option = `<option>${id}</option>`;
                $('#selDataset').append(option);
            });
            let initID = data["names"][0]

            optionChanged(initID);

        }
    });
}

function optionChanged(id) {
    loadMetaData(id);
    makeBarPlot(id);
    makeBubblePlot(id);
    makeGgePlot(id);
}

function loadMetaData(id) {
    $.ajax({
        type: 'GET',
        url: "static/data/samples.json",
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            let metaData = data["metadata"].filter(x => x.id == id)[0];
            //console.log(metaData);

            $('#sample-metadata').empty(); //clear the meta data table thing

            Object.entries(metaData).forEach(function([key, value]) {
                let info = `<p><b>${key.toUpperCase()}</b> : ${value} </p>`;
                $('#sample-metadata').append(info);
            });
        }
    });
}

function makeBarPlot(id) {
    $.ajax({
        type: 'GET',
        url: "static/data/samples.json",
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            let sampleData = data["samples"].filter(x => x.id == id)[0];
            let plotData = sampleData["otu_ids"].map(function(e, i) {
                return [e, sampleData["sample_values"][i]]; //creates a list of list
            });
            let plotData_Sorted = plotData.sort((a, b) => b[1] - a[1]);
            x = plotData_Sorted.map(x => x[1]).slice(0, 10).reverse() //[1] corresponds to the sample_value
            y = plotData_Sorted.map(x => "OTU " + x[0]).slice(0, 10).reverse() //[0] corresponds to the OTU ID (the OTU is neccessary to append)


            // THE Y axis as a string 
            var traces = [{
                type: 'bar',
                x: x,
                y: y,
                orientation: 'h',
                marker: {
                    color: '#00008B'
                }
            }];

            var layout = {
                title: 'OTU Ids to Values'
            };

            Plotly.newPlot('bar', traces, layout);
        }
    });
}

function makeBubblePlot(id) {
    $.ajax({
        type: 'GET',
        url: "static/data/samples.json",
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            let sampleData = data["samples"].filter(x => x.id == id)[0];

            var trace1 = {
                x: sampleData["otu_ids"],
                y: sampleData["sample_values"],
                mode: 'markers',
                marker: {
                    size: sampleData["sample_values"].map(x => x * 0.75),
                    color: sampleData["otu_ids"],
                    colorscale: 'Picnic'
                }
            };

            var data = [trace1];

            var layout = {
                title: 'OTU Ids to Values',
                showlegend: false,
                xaxis: { title: "OTU IDS" },
                yaxis: { title: "Values" },
            };

            Plotly.newPlot('bubble', data, layout);
        }
    });
}

function makeGgePlot(id) {
    $.ajax({
        type: 'GET',
        url: "static/data/samples.json",
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            let metaData = data["metadata"].filter(x => x.id == id)[0];
            //console.log(metaData);

            $('#gauge').empty(); //clear the meta data table thing


            var data = [{
                domain: { x: [0, 1], y: [0, 1] },
                value: metaData['wfreq'],
                title: {
                    text: "Belly Button Washing Frequency",
                },
                type: "indicator",
                mode: "gauge+number+delta",
                delta: { reference: 9 },
                gauge: {
                    axis: {
                        range: [null, 10]
                    },
                    bar: { color: "darkblue" },
                    steps: [
                        { range: [0, 1], color: "slateblue" },
                        { range: [1, 2], color: "royalblue" },
                        { range: [2, 3], color: "lightblue" },
                        { range: [3, 4], color: "lightsteelblue" },
                        { range: [4, 5], color: "lavenderblush" },
                        { range: [5, 6], color: "mistyrose" },
                        { range: [6, 7], color: "pink" },
                        { range: [7, 8], color: "lightpink" },
                        { range: [8, 9], color: "salmon" }
                    ],
                    threshold: {
                        line: { color: "red", width: 4 },
                        thickness: 0.75,
                        value: 9
                    }
                }
            }];

            var layout = {
                width: 600,
                height: 450,
                margin: { t: 0, b: 0 }
            };
            Plotly.newPlot('gauge', data, layout);
        }
    });
}