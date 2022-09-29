const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// creating variables so that they can be accessed outside of functions
var samples;
var metadata;
var names;
var ids = [];
var otu_ids = [];
var otu_ids_num = [];
var sample_values = [];
var otu_labels = [];
var barTrace;
var barData;
var barLayout;
var bubbleTrace;
var bubbleData;
var bubbleLayout;

// save data from d3 json call into variables
function saveData(data) {
    samples = data["samples"];
    metadata = data["metadata"];
    names = data["names"];
}

// get the sample data for each sample into lists
function sampleData(samples) {
    for (let i = 0; i < samples.length; i++) {
        ids.push(samples[i]["id"]);
        let temp_otu = [];
        for (let j = 0; j < samples[i]["otu_ids"].length; j++) {
            temp_otu.push(`OTU ${samples[i]["otu_ids"][j]}`);
        }
        otu_ids.push(temp_otu);

        otu_ids_num.push(samples[i]["otu_ids"]);
        sample_values.push(samples[i]["sample_values"]);
        otu_labels.push(samples[i]["otu_labels"]);
    };
}

// create the bar chart
function barPlot(sample_values, otu_ids, otu_labels) {

    let x_values = sample_values.slice(0, 10).reverse();
    let y_values = otu_ids.slice(0, 10).reverse();
    let text_values = otu_labels.slice(0, 10).reverse();

    barTrace = {
        x: x_values,
        y: y_values,
        text: text_values,
        type: 'bar',
        orientation: 'h'
    };
    
    barData = [barTrace];
    
    Plotly.newPlot("bar", barData);
};

// create the bubble chart
function bubbleChart(otu_ids, sample_values, otu_labels) {

    bubbleTrace = {
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        marker: {
            size: sample_values,
            color: otu_ids
        },
        text: otu_labels
    };

    bubbleData = [bubbleTrace];

    bubbleLayout = {
        xaxis: {title: {text: 'OTU ID'}}
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

}

// create the text for the metadata section
function metaDemo (metadata) {

    // d3.select("#sample-metadata").append("ul")

    let id = d3.select("ul").append("li");
    id.text(`id: ${metadata["id"]}`);

    let ethnicity = d3.select("ul").append("li");
    ethnicity.text(`ethnicity: ${metadata["ethnicity"]}`);

    let gender = d3.select("ul").append("li");
    gender.text(`gender: ${metadata["gender"]}`);

    let age = d3.select("ul").append("li");
    age.text(`age: ${metadata["age"]}`);

    let location = d3.select("ul").append("li");
    location.text(`location: ${metadata["location"]}`);

    let bbtype = d3.select("ul").append("li");
    bbtype.text(`bbtype: ${metadata["bbtype"]}`);

    let wfreq = d3.select("ul").append("li");
    wfreq.text(`wfreq: ${metadata["wfreq"]}`);
 }

function getNewData() {
    let dropdown = d3.select("#selDataset");
    let dataset = dropdown.property("value");
    let data = [];

    let indexData = names.indexOf(dataset);
    data = samples[indexData];
    let otu_id = otu_ids[indexData];

    updatePlotly(data, otu_id);

    // var container = document.getElementById("#metaID");
    // container.replaceChildren();
    d3.selectAll("li").remove();
    metaDemo(metadata[indexData]);
};

function updatePlotly(newData, otu_ids) {

    // get otu ids

    let x_values = newData["sample_values"].slice(0, 10).reverse();
    let y_values = otu_ids.slice(0, 10).reverse();
    let text_values = newData["otu_labels"].slice(0, 10).reverse();

    // let new_y_values = [];

    // for (let i = 0; i < y_values.length; i++) {
    //     new_y_values.push(`OTU ${y_values[i]}`)
    // };

    // console.log(x_values);

    var updateBar = {
        x: [x_values],
        y: [y_values],
        text: [text_values]
    };
    Plotly.restyle("bar", updateBar);

    var updateBubble = {
        x: [newData["otu_ids"]],
        y: [newData["sample_values"]],
        size: [newData["sample_values"]],
        color: [newData["otu_ids"]],
        text: [newData["otu_labels"]]
    };

    Plotly.restyle("bubble", updateBubble);

    // Plotly.restyle("bubble", "x", newData["otu_ids"]);
    // Plotly.restyle("bubble", "y", newData["sample_values"]);
    // Plotly.restyle("bubble", "size", newData["sample_values"]);
    // Plotly.restyle("bubble", "color", newData["otu_ids"]);
    // Plotly.restyle("bubble", "text", newData["otu_labels"]);

};


// get the data and then generate everything for the webpage
d3.json(url).then(function(data){
    console.log(data);

    saveData(data);
    sampleData(samples);

    barPlot(sample_values[0], otu_ids[0], otu_labels[0]);
    bubbleChart(otu_ids_num[0], sample_values[0], otu_labels[0]);
    metaDemo(metadata[0]);

    d3.select("#selDataset")
        .selectAll("myOptions")
            .data(names)
        .enter()
            .append('option')
        .text(function (name) {return name;})

    d3.selectAll("#selDataset").on("change", getNewData);

});

