

// Input Dropdown into html

d3.json("samples.json").then((importedData) => {
    var dropdown = d3.select("#selDataset");
    var all_ids = importedData.names;
    for (var i = 0; i<all_ids.length; i++){
        dropdown.append("option").text(all_ids[i]);
    };
});

// Initializes the page with a default plot

function init(){

    d3.json("samples.json").then((importedData) => {

    //default report (choose the first element as a default)
    var report_data = importedData.metadata[0];
    var report_body = d3.select("#sample-metadata").append("ul");
    for (const [key, value] of Object.entries(report_data)){
        report_body.append("li").text(`${key}: ${value}`);
    };

    //default horizontal bar chart
    var init_id = importedData.samples[0];

    //data are already sorted in desc order
    var init_sampleValue = init_id.sample_values.slice(0,10);
    var init_OTU_num = init_id.otu_ids.slice(0,10);
    var init_OTU_str = init_OTU_num.map(y => y.toString().concat(" ","OTU"))
    var init_label = init_id.otu_labels.slice(0,10);

    var trace_bar = {
        x: init_sampleValue,
        y: init_OTU_str,
        text: init_label,
        type: "bar",
        orientation: "h"
        };
    
    var init_bar_data = [trace_bar];
    Plotly.newPlot("bar",init_bar_data);

    // default bubble chart
    var trace_bubble = {
        x: init_id.otu_ids,
        y: init_id.sample_values,
        mode:"markers",
        marker: {
            color: init_id.otu_ids,
            size: init_id.sample_values
        }};
    var layout = {
        title: "Sample counts for OTU IDs",
        xaxis: {title:"OTU ID"} 
    }
    var init_bub_data = [trace_bubble];
    Plotly.newPlot("bubble",init_bub_data, layout);

    });
};

// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change",updatePlotly);

//This function is called when a dropdown menu item is selected
function updatePlotly(){
    var selected_id= d3.select("#selDataset").property("value");

    d3.json("samples.json").then((importedData) => {
    // index of selected id
    var index = importedData.names.indexOf(selected_id);
    var report_data = importedData.metadata[index];
    var chart_data = importedData.samples[index];

    //updated report for selected id
    d3.selectAll("ul").remove();
    
    var report_body = d3.select("#sample-metadata").append("ul");
    for (const [key, value] of Object.entries(report_data)){
        report_body.append("li").text(`${key}: ${value}`);
    };

    //updated bar chart for selected id
    var updated_y_num = chart_data.otu_ids.slice(0,10);
    var updated_y = updated_y_num.map(y => y.toString().concat(" ","OTU"));
    Plotly.restyle("bar","x",[chart_data.sample_values.slice(0,10)]);
    Plotly.restyle("bar","y",[updated_y]);
    Plotly.restyle("bar","text",[chart_data.otu_labels.slice(0,10)]);

    // updated bubble chart for selected id
    updated_marker = {color:chart_data.otu_ids,size: chart_data.sample_values}
    Plotly.restyle("bubble","x",[chart_data.otu_ids]);
    Plotly.restyle("bubble","y",[chart_data.sample_values]);
    Plotly.restyle("bubble","marker",[updated_marker]);

    })
};

init();