// const sample = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//get JSON data

function getJSONData(){

  let jsonObj = {
    barData: {
      sampleValues:"",
      otuIds: [],
      otuLabels:""
    },
    bubbleData: {
      sampleValues:"",
      otuIds: "",
      otuLabels:""
    }
  }


d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {

    //Set options for select id for the dropdown field
  for(subject of data.names){
    d3.select('#selDataset').append('option').attr('value', subject).text(subject);
  }
  var keys = Object.keys(data.metadata[0]);
  console.log(keys);

  var jsonSamples = data.samples;
  var jsonMetadata = data.metadata;
  var washFreq = [];
  var level;

  //Function to load the initial page
  function init(){
  
    //Horizontal bar chart
    jsonObj = JSONIteration(jsonSamples,data.names[0]);
        var dataPlot = [{
        x: jsonObj.barData.sampleValues,
        y: jsonObj.barData.otuIds,
        text: jsonObj.barData.otuLabels,
        type: "bar",
        transforms: [{
          type: 'sort',
          target: 'x',
          order: 'ascending'
        }],
        orientation: 'h'
      }];
      Plotly.newPlot('bar', dataPlot);
      
      //Bubble chart plotting
      var bubblePlot = [{
        x: jsonObj.bubbleData.otuIds,
        y: jsonObj.bubbleData.sampleValues,
        mode: 'markers',
        marker: {
          size: jsonObj.bubbleData.sampleValues,
          color: jsonObj.bubbleData.otuIds,
          colorscale:'Earth'
        },
        text: jsonObj.bubbleData.otuLabels
      }];
      var bubbleLayout = {
        xaxis: {
          title: {
            text: 'OTU ID'
          }
        },
        height: 600,
        width: 1200
      };
      Plotly.newPlot('bubble', bubblePlot, bubbleLayout);
   
      //Metadata display
      for(metadata of jsonMetadata){
        if(metadata.id == data.names[0]){
          level = metadata.wfreq;
          var table = d3.select("#sample-metadata").append("table");
          var tbody = table.append("tbody");
          for(let i=0; i<keys.length; i++){
            tbody.append("tr").append("td").text(keys[i]+": "+metadata[keys[i]]);
            console.log("metadata",keys[i]+":"+metadata[keys[i]]);
          }
        }
        washFreq.push(metadata.wfreq);
      }
      // Build gauge chart
      buildGauge(level);

  }

  function buildGauge(wfreq) {

    // Enter the washing frequency between 0 and 180
    let level = parseFloat(wfreq) * 20;
   
   // Trig to calc meter point
   var degrees = 180 - level;
   var radius = 0.5;
   var radians = (degrees * Math.PI) / 180;
   var x = radius * Math.cos(radians);
   var y = radius * Math.sin(radians);
   
   // Path: may have to change to create a better triangle
   var mainPath = "M -.0 -0.05 L .0 0.05 L ";
   var pathX = String(x);
   var space = " ";
   var pathY = String(y);
   var pathEnd = " Z";
   var path = mainPath.concat(pathX, space, pathY, pathEnd);
   
   var gaugeData = [
     {
       marker: { size: 12, color: "850000" },
       showlegend: false,
       name: "Freq",
       text: level,
       hoverinfo: "text+name",
       type: "scatter",
       x: [0],
       y: [0],
     },
     {
       values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
       rotation: 90,
       text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
       textinfo: "text",
       textposition: "inside",
       marker: {
         colors: [
           "rgba(0, 105, 11, .5)",
           "rgba(10, 120, 22, .5)",
           "rgba(14, 127, 0, .5)",
           "rgba(110, 154, 22, .5)",
           "rgba(170, 202, 42, .5)",
           "rgba(202, 209, 95, .5)",
           "rgba(210, 206, 145, .5)",
           "rgba(232, 226, 202, .5)",
           "rgba(240, 230, 215, .5)",
           "rgba(255, 255, 255, 0)",
         ],
       },
       labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
       hoverinfo: "label",
       hole: 0.5,
       type: "pie",
       showlegend: false,
     },
   ];
   
   var layout = {
     shapes: [
       {
         type: "path",
         path: path,
         fillcolor: "850000",
         line: {
           color: "850000",
         },
       },
     ],
     title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
     height: 500,
     width: 500,
     xaxis: {
       zeroline: false,
       showticklabels: false,
       showgrid: false,
       range: [-1, 1],
     },
     yaxis: {
       zeroline: false,
       showticklabels: false,
       showgrid: false,
       range: [-1, 1]
     }
   };
   
   Plotly.newPlot("gauge", gaugeData, layout);
   
   };

//Function to populate data for bar chart and bubble chart from JSON output
function JSONIteration(jsonSamples,subjectID){
  for(jsonData of jsonSamples){
    if(jsonData.id == subjectID){
      var otu_ids = jsonData.otu_ids.slice(0,10);
      jsonObj.barData.otuIds = [];
      for(ids of otu_ids){
        jsonObj.barData.otuIds.push("OTU "+ids);
      }
      jsonObj.barData.sampleValues = (jsonData.sample_values.slice(0,10));
      jsonObj.barData.otuLabels = (jsonData.otu_labels.slice(0,10));

      jsonObj.bubbleData.sampleValues = (jsonData.sample_values);
      jsonObj.bubbleData.otuIds = (jsonData.otu_ids);
      jsonObj.bubbleData.otuLabels = (jsonData.otu_labels);
    }
  }


  return jsonObj;
}

//Update code for change in dropdown list
  d3.selectAll("#selDataset").on("change", updatePlotly);

  function updatePlotly() {
      let dropdownMenu = d3.select("#selDataset");
      let subjectId = dropdownMenu.property("value");
      console.log("subject id",subjectId);
      // console.log(jsonSamples.length);
      jsonObj = JSONIteration(jsonSamples,subjectId);

    //Horizontal bar chart 
      var dataPlot = [{
      x: jsonObj.barData.sampleValues,
      y: jsonObj.barData.otuIds,
      text: jsonObj.barData.otuLabels,
      type: "bar",
      transforms: [{
        type: 'sort',
        target: 'x',
        order: 'ascending'
      }],
      orientation: 'h'
  }];
  Plotly.newPlot('bar', dataPlot);

  //Bubble chart update
  var bubbleDataPlot = [{
    x: jsonObj.bubbleData.otuIds,
    y: jsonObj.bubbleData.sampleValues,
    mode: 'markers',
    marker: {
      size: jsonObj.bubbleData.sampleValues,
      color: jsonObj.bubbleData.otuIds,
      colorscale:'Earth'
    },
    text: jsonObj.bubbleData.otuLabels
  }];
  var bubbleLayout = {
    xaxis: {
      title: {
        text: 'OTU ID'
      }
    },
    height: 600,
    width: 1200
  };
  Plotly.newPlot('bubble', bubbleDataPlot, bubbleLayout);
      
  //Update metadata table
  for(metadata of jsonMetadata){
    if(metadata.id == subjectId){
      console.log("metadata update",metadata.id);
      level = metadata.wfreq;
      d3.select('#sample-metadata tbody').remove();
      var tbody = d3.select("#sample-metadata").select("table").append("tbody");
      for(let i=0; i<keys.length; i++){
        tbody.append("tr").append("td").text(keys[i]+": "+metadata[keys[i]]);
        console.log("metadata update",keys[i]+":"+metadata[keys[i]]);
      }
    }
  }
  //Plot gauge chart
  buildGauge(level);
  }

  init();
  
  // console.log("sample values ****",jsonObj.sampleValues);

});
}

getJSONData();