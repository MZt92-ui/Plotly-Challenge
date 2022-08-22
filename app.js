

function init(){

    d3.json("samples.json").then((importedData) => {

    init_sample_value = importedData.samples[0]["sample_values"];
    init_otu = importedData.samples[0]["otu_ids"];
        
    var trace = {
        x: init_otu,
        y: init_sample_value,
        type: "bar",
        };
    init_bar = [trace];
    Plotly.newPlot("bar",init_bar);
    });
};

init();


