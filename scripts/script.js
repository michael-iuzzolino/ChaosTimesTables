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



var BACKGROUND_COLOR = [255, 242, 242];
var COLOR_MUTATION_MAG = 50;
var LINE_COLOR = [0, 0, 0];

var RANDOM_COLORS_PER_LINE = false;
var RANDOM_COLORS_PER_ITERATION = true;


function sleep(ms) {
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


async function generateDots(N, dots)
{
  var K = 2*Math.PI / N;
  var dot_radius = 2;
  
  for (var n=0; n < N; n++)
  {
    var x = CIRCLE_R * Math.cos(n*K + Math.PI) + CIRCLE_CENTER_H;
    var y = CIRCLE_R * Math.sin(n*K + Math.PI) + CIRCLE_CENTER_K;
    var coords = [x, y];
    dots.push(coords);
    
    MainContainer.append("circle")
                  .attr("cx", x)
                  .attr("cy", y)
                  .attr("r", dot_radius)
                  .style("fill", "black")
                  .attr("class", "dots");
    var text = MainContainer
                  .append("text")
                  .attr("x", function() { 
                    
                    var theta_x = Math.acos((x - CIRCLE_CENTER_H)/ CIRCLE_R);
                    var theta_y = Math.asin((y - CIRCLE_CENTER_K)/ CIRCLE_R);
                    var sign = theta_x / theta_y;
                    
                    var new_R = CIRCLE_R + 30;
                    if (sign >= 0)
                    {
                      var new_x = new_R * Math.cos(theta_x) + CIRCLE_CENTER_H;  
                    }
                    else
                    {
                      var new_x = new_R * Math.cos(theta_x) + CIRCLE_CENTER_H;
                    }
                    
                    return new_x;
                  })
                  .attr("y", function() { 
                    var theta_x = Math.acos((x - CIRCLE_CENTER_H)/ CIRCLE_R);
                    var theta_y = Math.asin((y - CIRCLE_CENTER_K)/ CIRCLE_R);
                    var sign = theta_x / theta_y;
                    
                    var new_R = CIRCLE_R + 30;
                    if (sign >= 0)
                    {
                      var new_y = new_R * Math.sin(theta_x) + CIRCLE_CENTER_K + 5;  
                    }
                    else
                    {
                      var new_y = new_R * Math.sin(theta_x+Math.PI) + CIRCLE_CENTER_K + 5;
                    }
                    
                    return new_y;
                  })
                  .text(function() { return n; })
                  .attr("font-size", "15px")
                  .attr("fill", "black")
                  .attr("class", "text");
  
  }
}

function mutateLineColor()
{  
  for (var i=0; i < LINE_COLOR.length; i++)
  {
    var mutationMagnitude = Math.random()*COLOR_MUTATION_MAG;
    var mutationDirection = (Math.floor(Math.random()*2) == 0) ? -1 : 1;
    var colorMutation = mutationMagnitude * mutationDirection;
    LINE_COLOR[i] += colorMutation; 
    
    if (LINE_COLOR[i] > 200)
    {
      LINE_COLOR[i] = 200;
    }
    else if (LINE_COLOR[i] < 0)
    {
      LINE_COLOR[i] = 0;
    }
  }
  
}

function generateCords(n, dots)
{
  for (var index_d_1=0; index_d_1 < dots.length; index_d_1++)
  {
    var dot_1_coords = dots[index_d_1];
    var index_d_2 = (index_d_1 * TIMES_TABLE) % n; 
    var dot_2_coords = dots[index_d_2];
    
    MainContainer.append("line")
                  .attr("x1", function() { return dot_1_coords[0]; })
                  .attr("y1", function() { return dot_1_coords[1]; })
                  .attr("x2", function() { return dot_2_coords[0]; })
                  .attr("y2", function() { return dot_2_coords[1]; })
                  .attr("stroke", function() { 
                          var [R, G, B] = LINE_COLOR;
                          return d3.rgb(R, G, B);
                  })
                  .attr("stroke-width", "2")
                  .attr("class", "line");
    if (RANDOM_COLORS_PER_LINE)
    {
      mutateLineColor();  
    }
    
  }
  if (RANDOM_COLORS_PER_ITERATION)
  {
    mutateLineColor();
  }
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
        stop();
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
  d3.select("#controls_container").append("p").html("Timestep (ms): ").append("input")
    .attr("type", "number")
    .attr("min", "0")
    .attr("step", "50")
    .attr("value", SLEEP_CONSTANT)
    .on("change", function() {
      SLEEP_CONSTANT = this.value;
    })
    .attr("id", "timestep_textfield");
  
  
  // Times table
  d3.select("#controls_container").append("p").html("Times Table (integer): ").append("input")
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
  d3.select("#controls_container").append("p").html("Upper Bound on Nodes: ").append("input")
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
  d3.select("#controls_container").append("p").html("App Scale: ").append("input")
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

}


function update_container(n)
{
  // Clean
  d3.selectAll(".dots").remove();
  d3.selectAll(".text").remove();
  d3.selectAll(".line").remove();
  
  // Add node counter
  MainContainer.append("text")
                  .attr("x", function() { return WIDTH-175; })
                  .attr("y", function() { return HEIGHT-20; })
                  .text(function() { return "Nodes: " + n; })
                  .attr("font-size", function() { return 30*SCALE +"px";})
                  .attr("fill", "black")
                  .attr("class", "text");
  
  // Add Times-Table indicator
  MainContainer.append("text")
                  .text(function() { return "Chaotic Times Table: x" + TIMES_TABLE; })
                  .attr("x", function() { return (WIDTH / 2) - this.getComputedTextLength(); })
                  .attr("y", function() { return 35; })
                  .attr("font-size", function() { return 30*SCALE +"px";})
                  .attr("fill", "black")
                  .attr("class", "text");
  
  
  // Time-step
  MainContainer.append("text")
                  .attr("x", function() { return 25; })
                  .attr("y", function() { return HEIGHT-20; })
                  .text(function() { return "Timestep: " + SLEEP_CONSTANT + "ms"; })
                  .attr("font-size", function() { return 15*SCALE +"px";})
                  .attr("fill", "black")
                  .attr("class", "text");
}
  

async function start()
{
  INTERUPT = false;
  STOP = false;
  RUNNING = true;
  for (var n=N_LOWER_BOUND; n <= N_UPPER_BOUND; n++)
  {
    update_container(n)
    
    var dots = []
    generateDots(n, dots);
    generateCords(n, dots);   
    
    if (STOP)
    {
      break;
    }
    if (INTERUPT)
    {
      N_LOWER_BOUND = n;
      break;
    }
    
    await sleep(SLEEP_CONSTANT);
  }
  RUNNING = false;
}

function stop()
{
  INTERUPT = true;
}

async function reset()
{
  d3.select("#start_stop_button").attr("value", "...");
  STOP = true;
  await sleep(1000);
  
  N_LOWER_BOUND = 0;
  
  d3.select("#start_stop_button").attr("value", "Start");
  d3.selectAll(".dots").remove();
  d3.selectAll(".text").remove();
  d3.selectAll(".line").remove();
}

function setup()
{
  initializeImage();
  initializeSettings();
}