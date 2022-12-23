const url ="https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Bargraph
function DrawBargraph(sampleId) {
    
    d3.json(url).then(data=> {

        let samples=data.samples;
        let resultArray = samples.filter(s => s.id == sampleId);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels= result.otu_labels;
        let sample_values = result.sample_values;

        let barData = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`),
            type: 'bar',
            text: otu_labels.slice(0,10).reverse(),
            orientation: 'h'
        };

        let barArray = [barData];

        let barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150},
        };

        Plotly.newPlot("bar", barArray, barLayout);

    });

};
// Bubble Plot
function DrawBubblePlot(sampleId) {
    
    d3.json(url).then(data=> {

        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleId);
        let result = resultArray[0]

        let otu_ids = result.otu_ids;
        let otu_labels= result.otu_labels;
        let sample_values = result.sample_values;

        let bubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
            
        };

        let bubbleArray = [bubbleData];

        let bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: {t: 30},
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", bubbleArray, bubbleLayout);

    });

};

function ShowMetadata(sampleId) {

    d3.json(url).then(data => {

        let metadata = data.metadata;
        let resultArray = metadata.filter(s => s.id == sampleId);
        let result = resultArray[0];

        let display = d3.select("#sample-metadata");
        display.html("");

        Object.entries(result).forEach(([key,value])=> {
            display.append("h6").text(`${key}: ${value}`);
        });    

    });

};

function optionChanged(sampleId) {

    DrawBargraph(sampleId);
    DrawBubblePlot(sampleId);
    ShowMetadata(sampleId);

};

function InitDashboard ()
{
    let selector=d3.select("#selDataset");

    d3.json(url).then(data=> {
    
        let sampleNames = data.names;
        for (let i=0; i<sampleNames.length; i++) {

            let sampleId=sampleNames[i];

            selector.append("option").text(sampleId).property("value", sampleId);
        };

        let initialId = selector.property("value");

        DrawBargraph(initialId);

        DrawBubblePlot(initialId);

        ShowMetadata(initialId);
    });
};
InitDashboard();