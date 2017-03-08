function mutateLineColor()
{  
  var color_ids = ['r', 'g', 'b'];
  for (var i=0; i < 3; i++)
  {
    var mutationMagnitude = Math.random()*COLOR_MUTATION_MAG;
    var mutationDirection = (Math.floor(Math.random()*2) == 0) ? -1 : 1;
    var colorMutation = mutationMagnitude * mutationDirection;
    var color = color_ids[i];
    line_color[color] += colorMutation;
    
    
    if (line_color[color] > 200)
    {
      line_color[color] = 200;
    }
    else if (line_color[color] < 0)
    {
      line_color[color] = 0;
    }
  }
}

function createNodes(x, y, dot_radius)
{
  SVGContainer.append("circle")
              .attr("cx", x)
              .attr("cy", y)
              .attr("r", dot_radius)
              .style("fill", NODE_COLOR)
              .attr("class", "dots");
}



function numberNodes(x, y, n)
{
  var new_R, theta_x, theta_y, sign, new_x, new_y;
  
  SVGContainer.append("text")
            .text(function() { return n; })
            .attr("x", function() 
            { 
              new_R = CIRCLE_R + CIRCLE_R*NODE_NUMBER_SCALE_FACTOR;

              if (n == 0)
              {
                return CIRCLE_CENTER_H - new_R;
              }
              theta_x = Math.acos((x - CIRCLE_CENTER_H)/ CIRCLE_R);
              theta_y = Math.asin((y - CIRCLE_CENTER_K)/ CIRCLE_R);
              sign = theta_x / theta_y;

              if (sign >= 0)
              {
                new_x = new_R * Math.cos(theta_x) + CIRCLE_CENTER_H- this.getComputedTextLength()*SCALE;  
              }
              else
              {
                new_x = new_R * Math.cos(theta_x) + CIRCLE_CENTER_H - this.getComputedTextLength()*SCALE;
              }

              return new_x;
            })
            .attr("y", function() 
            { 
              new_R = CIRCLE_R + CIRCLE_R*NODE_NUMBER_SCALE_FACTOR;

              if (n == 0)
              {
                return CIRCLE_CENTER_K + (this.getComputedTextLength() - 4)*SCALE;
              }
              theta_x = Math.acos((x - CIRCLE_CENTER_H)/ CIRCLE_R);
              theta_y = Math.asin((y - CIRCLE_CENTER_K)/ CIRCLE_R);
              sign = theta_x / theta_y;

              if (sign >= 0)
              {
                new_y = new_R * Math.sin(theta_x) + CIRCLE_CENTER_K+ 20*SCALE;  
              }
              else
              {
                new_y = new_R * Math.sin(theta_x+Math.PI) + CIRCLE_CENTER_K ;
              }

              return new_y;
            })
            .attr("font-size", function() { return 15*SCALE +"px";})
            .attr("fill", TEXT_COLOR)
            .attr("class", "text");
}