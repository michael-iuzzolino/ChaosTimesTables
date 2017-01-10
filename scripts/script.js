




async function generateDots(N, dots)
{
  var K = 2*Math.PI / N;
  var dot_radius = 2 * SCALE;
  
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
    
    if (!NODE_NUMBERS)
    {
      continue;
    }
    else if (N < 50)
    {
      numberNodes(x, y, n);
    }
    else if (N < 500)
    {
      if (n % 10 == 0)
      {
        numberNodes(x, y, n);
      }
    }
    else if (N < 3000)
    {
      if (n % 50 == 0)
      {
        numberNodes(x, y, n);
      }
    }
    else
    {
      if (n % 100 == 0)
      {
        numberNodes(x, y, n);
      }
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


function updateCircle(n)
{
  // Clean
  cleanCircle();
  
  // HEADER:  Times-Table indicator
  MainContainer.append("text")
                  .text(function() { return "Chaotic Times Table: x" + TIMES_TABLE; })
                  .attr("x", function() { 
                        var new_x = (WIDTH * 0.5) - this.getComputedTextLength()*SCALE;
                        return new_x; 
                  })
                  .attr("y", function() { 
                        var new_y = (HEIGHT*0.08) - this.getComputedTextLength()*0.08*SCALE; 
                        return new_y;
                  })
                  .attr("font-size", function() { return 30*SCALE +"px";})
                  .attr("fill", "black")
                  .attr("class", "text");
  
  // Add node counter
  MainContainer.append("text")
                  .text(function() { return "Nodes: " + n; })
                  .attr("x", function() {
                        var new_x = (WIDTH * 0.85) - this.getComputedTextLength()*SCALE;
                        return new_x; 
                  })
                  .attr("y", function() { 
                        var new_y = (HEIGHT * 0.98) - this.getComputedTextLength()*0.1*SCALE;
                        return new_y; 
                  })
                  .attr("font-size", function() { return 30*SCALE +"px";})
                  .attr("fill", "black")
                  .attr("class", "text");
  
  
  // Time-step
  MainContainer.append("text")
                  .text(function() { return "Timestep: " + SLEEP_CONSTANT + "ms"; })
                  .attr("x", function() { 
                      var new_x = (WIDTH * 0.01);
                      return new_x; 
                  })
                  .attr("y", function() { 
                      var new_y = (HEIGHT * 0.99) - this.getComputedTextLength()*0.1*SCALE; 
                      return new_y; 
                  })
                  .attr("font-size", function() { return 15*SCALE +"px";})
                  .attr("fill", "black")
                  .attr("class", "text");
}
  

async function start()
{
  INTERUPT = false;
  STOP = false;
  RUNNING = true;
  var dots;
  
  for (var n=N_LOWER_BOUND; n <= N_UPPER_BOUND; n++)
  {
    updateCircle(n)
    
    dots = []
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


function cleanCircle()
{
  d3.selectAll(".dots").remove();
  d3.selectAll(".text").remove();
  d3.selectAll(".line").remove();
}


async function reset()
{
  d3.select("#start_stop_button").attr("value", "...");
  STOP = true;
  await sleep(1000);
  
  N_LOWER_BOUND = 0;
  
  d3.select("#start_stop_button").attr("value", "Start");
  cleanCircle();
}