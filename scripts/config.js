// http://www.d3noob.org/2014/04/using-html-inputs-with-d3js.html
var MainContainer, SVGContainer;
var SCALE = 1.0;
var DOT_SCALE = 2.0;

var HEIGHT, WIDTH;

var CIRCLE_CENTER_H, CIRCLE_CENTER_K, CIRCLE_R;

var INTERUPT, STOP, RUNNING;

var TEXT_COLOR = d3.rgb(0, 0, 0);
var NODE_COLOR = d3.rgb(255, 0, 0);

var N_LOWER_BOUND = 0;
var N_UPPER_BOUND = 800;
var TIMES_TABLE = 302;

var SLEEP_CONSTANT = 150;

var NODE_NUMBERS = true;

var BACKGROUND_COLOR = d3.rgb(226, 255, 254);
var CIRCLE_BORDER = d3.rgb(255, 255, 255)
var CIRCLE_FILL = d3.rgb(255, 255, 255);

var COLOR_MUTATION_MAG = 50;
var LINE_COLOR_DEFAULT = d3.rgb(0, 0, 0);
var CONTROL_CONTAINER_BACKGROUND = d3.rgb(225, 240, 240);
var SVG_CONTAINER_BACKGROUND = d3.rgb(226, 250, 250);
var line_color;

var RANDOM_COLORS_PER_LINE = false;
var RANDOM_COLORS_PER_ITERATION = true;

var NODE_NUMBER_SCALE_FACTOR = 0.075;


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

  WorldContainer = d3.select("body").append("div").attr("id", "WorldContainer").append("div").attr("id", "SVGContainer").style("border-style", "solid").style("border-width", "1px").style("background-color", SVG_CONTAINER_BACKGROUND);
  
  SVGContainer = WorldContainer.append("svg").attr("width", WIDTH).attr("height", HEIGHT);
  
  SVGContainer.append("rect")
                .attr("width", WIDTH)
                .attr("height", HEIGHT)
                .attr("fill", BACKGROUND_COLOR);
  
  SVGContainer.append("circle")
                .attr("cx", CIRCLE_CENTER_H)
                .attr("cy", CIRCLE_CENTER_K)
                .attr("r", CIRCLE_R)
                .style("stroke", CIRCLE_BORDER)
                .style("fill", CIRCLE_FILL);
}


function updateText(id, value)
{
  console.log("ID: " + id);
  console.log("New sleep constant: " + SLEEP_CONSTANT);
  d3.select(id).select("p")
      .html(function ()
      {
        return "Timestep (ms): " + value + " ";
      });
         
}

function initializeSettings()
{
  d3.select("#WorldContainer").append("div").attr("id", "controls_container")
        .style("border-style", "solid")
        .style("border-width", "1px")
        .style("padding", "20px")
        .style("background-color", CONTROL_CONTAINER_BACKGROUND);
        
  
  // Start - Stop button
  d3.select("#controls_container")
        .append("input")
        .attr("type", "button")
        .attr("value", "Start")
        .on("click", function() 
        { 
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
        .on("click", function() 
        {
          reset();
        })
        .attr("id", "pause_button");
  
  
  // Timestep textfield
  // Slider reference: http://bl.ocks.org/d3noob/10632804
  d3.select("#controls_container").append("p")
        .html( function()
        {
          return "Timestep (ms): " + SLEEP_CONSTANT + " ";
        })
        .style("font-size", function()
        {
          return 18*SCALE + "px";
        })
        .attr("id", "#timestep_text")
  
  d3.select("#controls_container")
        .append("span")
        .append("input")
        .attr("type", "range")
        .attr("min", "0")
        .attr("max", "1000")
        .attr("step", "10")
        .attr("value", SLEEP_CONSTANT)
        .on("input", function() 
        {
          SLEEP_CONSTANT = this.value;
          updateText("#controls_container", this.value);
          
        })
        .attr("id", "timestep_textfield");
  
  
  // Times table
  d3.select("#controls_container").append("p")
        .html("Times Table (integer): ")
        .style("font-size", function()
        {
          return 18*SCALE + "px";
        })
        .append("input")
        .attr("type", "number")
        .attr("min", "2")
        .attr("step", "1")
        .attr("value", TIMES_TABLE)
        .on("change", function() 
        {
          reset();
          TIMES_TABLE = this.value;
        })
        .attr("id", "pause_button");
  
  
  
  
  // Min Nodes table
  d3.select("#controls_container")
        .append("p")
        .html("Starting Node: ")
        .style("font-size", function()
        {
          return 18*SCALE + "px";
        })
        .append("input")
        .attr("type", "number")
        .attr("min", "2")
        .attr("step", "1")
        .attr("value", N_LOWER_BOUND)
        .on("input", function() 
        {
          if (!RUNNING)
          {
            N_LOWER_BOUND = this.value;
            start();
          }
          else
          {
            N_LOWER_BOUND = this.value;
            reset();   
          }
        })
        .attr("id", "node_upper_bound");

  
  // Max Nodes table
  d3.select("#controls_container")
        .append("p")
        .html("Ending Nodes: ")
        .style("font-size", function()
        {
          return 18*SCALE + "px";
        })
        .append("input")
        .attr("type", "number")
        .attr("min", "2")
        .attr("step", "1")
        .attr("value", N_UPPER_BOUND)
        .on("input", function() 
        {
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
  d3.select("#controls_container").append("p").html("App Scale: ")
        .style("font-size", function()
        {
          return 18*SCALE + "px";
        })
        .append("input")
        .attr("type", "number")
        .attr("min", "0.1")
        .attr("max", "2")
        .attr("step", "0.1")
        .attr("value", SCALE)
        .on("input", function() 
        {
          SCALE = this.value;  
          reset();
          setup();        
        })
        .attr("id", "screen_scale_button");
  
  
  // Node number checkbox
  d3.select("#controls_container")
        .append("p")
        .html("Node Numbers: <b>ON</b> / off" )
        .style("font-size", function()
        {
          return 18*SCALE + "px";
        })
        .attr("id", "node_number_on_off_text");
  
  
  
  // Color checkbox
  d3.select("#controls_container").append("p")
        .html("Color Scheme: <b>ON</b> / off / random" )
        .style("font-size", function()
        {
          return 18*SCALE + "px";
        })
        .attr("id", "color_selectors");
  
  nodeNumOnOff();
  colorMode();
}


function colorMode()
{
  // checkbox 1
  d3.select("#color_selectors")
        .append("form").html("Color Evolution ")
        .append("input").attr("type", "checkbox")
        .on("click", function() 
        {
          var checkbox = d3.select("#color_select_checkbox_1");
          if (checkbox.property("checked"))
          {
            d3.select("#color_select_checkbox_2")
                      .property("checked", false);
            RANDOM_COLORS_PER_ITERATION = true;
            RANDOM_COLORS_PER_LINE = false;
            d3.select("#color_selectors")
                    .html("Color Scheme: <b>ON</b> / off / random" )
                    .style("font-size", function()
                    {
                      return 18*SCALE + "px";
                    });
          }
          else if (d3.select("#color_select_checkbox_2").property("checked"))
          {
            RANDOM_COLORS_PER_ITERATION = false;
            RANDOM_COLORS_PER_LINE = true;
            d3.select("#color_selectors")
                    .html("Color Scheme: on / off / <b>RANDOM</b>" )
                    .style("font-size", function()
                    {
                      return 18*SCALE + "px";
                    });
          }
          else
          {
            RANDOM_COLORS_PER_ITERATION = false;
            RANDOM_COLORS_PER_LINE = false
            d3.select("#color_selectors")
              .html("Color Scheme: on / <b>OFF</b> / random" )
              .style("font-size", function()
              {
                return 18*SCALE + "px";
              });
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
              d3.select("#color_selectors")
                    .html("Color Scheme: on / off / <b>RANDOM</b>" )
                    .style("font-size", function()
                    {
                      return 18*SCALE + "px";
                    });
            }
            else if (d3.select("#color_select_checkbox_1").property("checked"))
            {
              RANDOM_COLORS_PER_ITERATION = true;
              RANDOM_COLORS_PER_LINE = false;
              d3.select("#color_selectors")
                      .html("Color Scheme: <b>ON</b> / off / random" )
                      .style("font-size", function()
                      {
                        return 18*SCALE + "px";
                      });
            }
            else
            {
              RANDOM_COLORS_PER_ITERATION = false;
              RANDOM_COLORS_PER_LINE = false
              d3.select("#color_selectors")
                      .html("Color Scheme: on / <b>OFF</b> / random" )
                      .style("font-size", function()
                      {
                        return 18*SCALE + "px";
                      });
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
        .on("click", function() 
        {
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