// http://www.d3noob.org/2014/04/using-html-inputs-with-d3js.html
var MainContainer;
var SCALE = 1.0;

var HEIGHT, WIDTH;

var CIRCLE_CENTER_H, CIRCLE_CENTER_K, CIRCLE_R;

var INTERUPT, STOP, RUNNING;


var N_LOWER_BOUND = 0;
var N_UPPER_BOUND = 800;
var TIMES_TABLE = 7;

var SLEEP_CONSTANT = 500;


var NODE_NUMBERS = true;

var BACKGROUND_COLOR = [255, 242, 242];
var COLOR_MUTATION_MAG = 50;
var LINE_COLOR = [0, 0, 0];

var RANDOM_COLORS_PER_LINE = false;
var RANDOM_COLORS_PER_ITERATION = true;



function sleep(ms) 
{
  return new Promise(resolve => setTimeout(resolve, ms));
}


function initializeImage()
{
  d3.select("#WorldContainer").remove();
  d3.select("#controls_container").remove();
  HEIGHT = 600 * SCALE;
  WIDTH = HEIGHT;
  CIRCLE_CENTER_H = HEIGHT / 2;
  CIRCLE_CENTER_K = HEIGHT / 2;
  CIRCLE_R = HEIGHT * 0.4;

  MainContainer = d3.select("body").append("svg").attr("width", WIDTH).attr("height", HEIGHT).attr("id", "WorldContainer");
  
  MainContainer.append("rect")
                .attr("width", WIDTH)
                .attr("height", HEIGHT)
                .attr("fill", function(d) {
                      var [R, G, B] = BACKGROUND_COLOR;
                      return d3.rgb(R, G, B);});
  
  MainContainer.append("circle")
                .attr("cx", CIRCLE_CENTER_H)
                .attr("cy", CIRCLE_CENTER_K)
                .attr("r", CIRCLE_R)
                .style("stroke", "black")
                .style("fill", "white");
}




function initializeSettings()
{
  d3.select("body").append("div").attr("id", "controls_container");
  // Start - Stop button
  d3.select("#controls_container").append("input")
    .attr("type", "button")
    .attr("value", "Start")
    .on("click", function() { 
      
      if (this.value == "Start")
      {
        start(); 
        this.value = "Stop";
      }
      else if (this.value == "Stop")
      {
        INTERUPT = true;
        this.value = "Start";
      }
    })
    .attr("id", "start_stop_button");
  
  // Reset button
  d3.select("#controls_container").append("input")
    .attr("type", "button")
    .attr("value", "Reset")
    .on("click", function() {
      reset();
    })
    .attr("id", "pause_button");
  
  // Timestep textfield
  d3.select("#controls_container").append("p").html("Timestep (ms): ").style("font-size", function(){
                  return 18*SCALE + "px";
    })
    .append("input")
    .attr("type", "number")
    .attr("min", "0")
    .attr("step", "50")
    .attr("value", SLEEP_CONSTANT)
    .on("change", function() {
      SLEEP_CONSTANT = this.value;
    })
    .attr("id", "timestep_textfield");
  
  
  // Times table
  d3.select("#controls_container").append("p").html("Times Table (integer): ").style("font-size", function(){
                  return 18*SCALE + "px";
    })
    .append("input")
    .attr("type", "number")
    .attr("min", "2")
    .attr("step", "1")
    .attr("value", TIMES_TABLE)
    .on("change", function() {
      reset();
      TIMES_TABLE = this.value;

    })
    .attr("id", "pause_button");
  
  
  
  
  // Max Nodes table
  d3.select("#controls_container").append("p").html("Upper Bound on Nodes: ").style("font-size", function(){
                  return 18*SCALE + "px";
    })

    .append("input")
    .attr("type", "text")
    .attr("value", N_UPPER_BOUND)
    .on("change", function() {
      if (!RUNNING)
      {
        N_LOWER_BOUND = N_UPPER_BOUND;
        N_UPPER_BOUND = this.value;
        start();
      }
      else
      {
        N_UPPER_BOUND = this.value;    
      }
    })
    .attr("id", "node_upper_bound");
  
  
  
  
  // Screen scale
  d3.select("#controls_container").append("p").html("App Scale: ").style("font-size", function()
                                                                         {
                  return 18*SCALE + "px";
    })
    .append("input")
    .attr("type", "number")
    .attr("min", "0.1")
    .attr("max", "2")
    .attr("step", "0.1")
    .attr("value", SCALE)
    .on("change", function() {
      SCALE = this.value;  
      reset();
      setup();        
    })
    .attr("id", "screen_scale_button");
  
  
  // Node number checkbox
  d3.select("#controls_container").append("p")
                              .html("Node Numbers: <b>ON</b> / off" ).style("font-size", function(){
                  return 18*SCALE + "px";})
                              .attr("id", "node_number_on_off_text");
  nodeNumOnOff();
  
  
  // Color checkbox
  d3.select("#controls_container").append("p")
                              .html("Color Scheme: <b>ON</b> / off / random" ).style("font-size", function(){
                  return 18*SCALE + "px";})
                              .attr("id", "color_selectors");
  colorMode();
}


function colorMode()
{
  // checkbox 1
  d3.select("#color_selectors")
    .append("form").html("Color Evolution ")
    .append("input").attr("type", "checkbox")
  
    
    .on("click", function() {
        var checkbox = d3.select("#color_select_checkbox_1");
        if (checkbox.property("checked"))
        {
          d3.select("#color_select_checkbox_2").property("checked", false);
          RANDOM_COLORS_PER_ITERATION = true;
          RANDOM_COLORS_PER_LINE = false;
          d3.select("#color_selectors").html("Color Scheme: <b>ON</b> / off / random" ).style("font-size", function(){
                  return 18*SCALE + "px";});
        }
        else if (d3.select("#color_select_checkbox_2").property("checked"))
        {
          RANDOM_COLORS_PER_ITERATION = false;
          RANDOM_COLORS_PER_LINE = true;
          d3.select("#color_selectors").html("Color Scheme: on / off / <b>RANDOM</b>" ).style("font-size", function(){
                  return 18*SCALE + "px";});
        }
        else
        {
          RANDOM_COLORS_PER_ITERATION = false;
          RANDOM_COLORS_PER_LINE = false
          d3.select("#color_selectors").html("Color Scheme: on / <b>OFF</b> / random" ).style("font-size", function(){
                  return 18*SCALE + "px";});
        }
        colorMode();  
    })
    .attr("id", "color_select_checkbox_1");
  
  // checkbox 2
  d3.select("#color_selectors")
    .append("form").html("Random Chord Colors ")
    .append("input").attr("type", "checkbox")
    
    .on("click", function() {
        var checkbox = d3.select("#color_select_checkbox_2");
        if (checkbox.property("checked"))
        {
          d3.select("#color_select_checkbox_1").property("checked", false);
          RANDOM_COLORS_PER_ITERATION = false;
          RANDOM_COLORS_PER_LINE = true;
          d3.select("#color_selectors").html("Color Scheme: on / off / <b>RANDOM</b>" ).style("font-size", function(){
                  return 18*SCALE + "px";});
        }
        else if (d3.select("#color_select_checkbox_1").property("checked"))
        {
          RANDOM_COLORS_PER_ITERATION = true;
          RANDOM_COLORS_PER_LINE = false;
          d3.select("#color_selectors").html("Color Scheme: <b>ON</b> / off / random" ).style("font-size", function(){
                  return 18*SCALE + "px";});
        }
        else
        {
          RANDOM_COLORS_PER_ITERATION = false;
          RANDOM_COLORS_PER_LINE = false
          d3.select("#color_selectors").html("Color Scheme: on / <b>OFF</b> / random" ).style("font-size", function(){
                  return 18*SCALE + "px";});
        }
        colorMode();
    })
    .attr("id", "color_select_checkbox_2");
  
  d3.select("#color_select_checkbox_1").property("checked", RANDOM_COLORS_PER_ITERATION);
  d3.select("#color_select_checkbox_2").property("checked", RANDOM_COLORS_PER_LINE);
}



function nodeNumOnOff()
{
  d3.select("#node_number_on_off_text")
    .append("form")
    .append("input").attr("type", "checkbox")
    
    .on("click", function() {
        var checkbox = d3.select("#node_number_checkbox");
        if (checkbox.property("checked"))
        {
          NODE_NUMBERS = true;
          d3.select("#node_number_on_off_text").html("Node Numbers: <b>ON</b> / off" );
        }
        else
        {
          NODE_NUMBERS = false;
          d3.select("#node_number_on_off_text").html("Node Numbers: on / <b>OFF</b>" );
        }
        nodeNumOnOff();
    })
    .attr("id", "node_number_checkbox");
  d3.select("#node_number_checkbox").property("checked", NODE_NUMBERS);
}

function setup()
{
  initializeImage();
  initializeSettings();
}