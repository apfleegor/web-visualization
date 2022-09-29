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

    // loop through the sample data
    for (let i = 0; i < samples.length; i++) {
        
        // creating the labels that are the string "OTU 970", etc.
        let temp_otu = [];

        // loop through the otu_ids (since they are in a list) and add the string version to the temp_otu list
        for (let j = 0; j < samples[i]["otu_ids"].length; j++) {
            temp_otu.push(`OTU ${samples[i]["otu_ids"][j]}`);
        }
        // push the string version of the otu ids to the corresponding variable
        otu_ids.push(temp_otu);

        // put the rest of the data into their respective lists
        ids.push(samples[i]["id"]);
        otu_ids_num.push(samples[i]["otu_ids"]);
        sample_values.push(samples[i]["sample_values"]);
        otu_labels.push(samples[i]["otu_labels"]);
    };
}

// create the bar chart
function barPlot(sample_values, otu_ids, otu_labels) {

    // splice to get the first 10 otu ids
    // reverse the order so that they will appear in descending order
    let x_values = sample_values.slice(0, 10).reverse();
    let y_values = otu_ids.slice(0, 10).reverse();
    let text_values = otu_labels.slice(0, 10).reverse();

    // create the trace, including the horizontal orientation
    barTrace = {
        x: x_values,
        y: y_values,
        text: text_values,
        type: 'bar',
        orientation: 'h'
    };
    
    // plot the data
    barData = [barTrace];
    Plotly.newPlot("bar", barData);
};

// create the bubble chart
function bubbleChart(otu_ids, sample_values, otu_labels) {

    // create the bubble trace, making sure to match corresponding variables
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

    // label the x axis for our chart
    bubbleLayout = {
        xaxis: {title: {text: 'OTU ID'}}
    };

    // plot the bubble chart
    bubbleData = [bubbleTrace];
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
};

// create the text for the metadata section
function metaDemo (metadata) {

    // id
    let id = d3.select("ul").append("li");
    id.text(`id: ${metadata["id"]}`);

    // ethnicity
    let ethnicity = d3.select("ul").append("li");
    ethnicity.text(`ethnicity: ${metadata["ethnicity"]}`);

    // gender
    let gender = d3.select("ul").append("li");
    gender.text(`gender: ${metadata["gender"]}`);

    // age
    let age = d3.select("ul").append("li");
    age.text(`age: ${metadata["age"]}`);

    // location
    let location = d3.select("ul").append("li");
    location.text(`location: ${metadata["location"]}`);

    // bbtype
    let bbtype = d3.select("ul").append("li");
    bbtype.text(`bbtype: ${metadata["bbtype"]}`);

    // wfreq
    let wfreq = d3.select("ul").append("li");
    wfreq.text(`wfreq: ${metadata["wfreq"]}`);
 };

 // function to get new data when new dropdown item selected
function getNewData() {
    // select the dropdown menu element
    let dropdown = d3.select("#selDataset");

    // get the value selected
    let dataset = dropdown.property("value");

    // get the index of the value and then find the new data
    let indexData = names.indexOf(dataset);
    let data = samples[indexData];

    // get the otu_ids so the properly formatted strings can be used
    let otu_id = otu_ids[indexData];

    // call the update function to update the graphs
    updatePlotly(data, otu_id);

    // remove all previous metadata
    d3.selectAll("li").remove();

    // call the function to insert metadata for new value
    metaDemo(metadata[indexData]);
};

// function to update the graphs when given new data
function updatePlotly(newData, otu_ids) {

    // get the first 10 for the bar chart variables and reverse
    let x_values = newData["sample_values"].slice(0, 10).reverse();
    let y_values = otu_ids.slice(0, 10).reverse();
    let text_values = newData["otu_labels"].slice(0, 10).reverse();

    // create a variable with the updated bar chart information
    var updateBar = {
        x: [x_values],
        y: [y_values],
        text: [text_values]
    };

    // update the bar chart
    Plotly.restyle("bar", updateBar);

    // create a variable with the updated bubble chart info
    var updateBubble = {
        x: [newData["otu_ids"]],
        y: [newData["sample_values"]],
        size: [newData["sample_values"]],
        color: [newData["otu_ids"]],
        text: [newData["otu_labels"]]
    };

    // update the bubble chart
    Plotly.restyle("bubble", updateBubble);
};


// get the data and then generate everything for the webpage
d3.json(url).then(function(data){

    // save data to local variables for processing
    saveData(data);

    // get the sample data into lists of its components
    sampleData(samples);

    // create the charts and metadata
    barPlot(sample_values[0], otu_ids[0], otu_labels[0]);
    bubbleChart(otu_ids_num[0], sample_values[0], otu_labels[0]);
    metaDemo(metadata[0]);

    // create the dropdown menu
    d3.select("#selDataset")
        .selectAll("myOptions")
            .data(names)
        .enter()
            .append('option')
        .text(function (name) {return name;})

    // when new value is chosen, run the get new data function
    d3.selectAll("#selDataset").on("change", getNewData);

});

