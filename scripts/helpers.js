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

function createNodes(x, y, dot_radius)
{
  MainContainer.append("circle")
                  .attr("cx", x)
                  .attr("cy", y)
                  .attr("r", dot_radius)
                  .style("fill", "black")
                  .attr("class", "dots");
}



function numberNodes(x, y, n)
{
  MainContainer.append("text")
          .text(function() { return n; })
          .attr("x", function() { 
            
            var new_R = CIRCLE_R + CIRCLE_R*0.1;
    
            if (n == 0)
            {
              return CIRCLE_CENTER_H - new_R;
            }
            var theta_x = Math.acos((x - CIRCLE_CENTER_H)/ CIRCLE_R);
            var theta_y = Math.asin((y - CIRCLE_CENTER_K)/ CIRCLE_R);
            var sign = theta_x / theta_y;

            
            if (sign >= 0)
            {
              var new_x = new_R * Math.cos(theta_x) + CIRCLE_CENTER_H- this.getComputedTextLength()*SCALE;  
            }
            else
            {
              var new_x = new_R * Math.cos(theta_x) + CIRCLE_CENTER_H - this.getComputedTextLength()*SCALE;
            }

            return new_x;
          })
          .attr("y", function() { 
            var new_R = CIRCLE_R + CIRCLE_R*0.1;
    
            if (n == 0)
            {
              return CIRCLE_CENTER_K + (this.getComputedTextLength() - 4)*SCALE;
            }
            var theta_x = Math.acos((x - CIRCLE_CENTER_H)/ CIRCLE_R);
            var theta_y = Math.asin((y - CIRCLE_CENTER_K)/ CIRCLE_R);
            var sign = theta_x / theta_y;
            
            if (sign >= 0)
            {
              var new_y = new_R * Math.sin(theta_x) + CIRCLE_CENTER_K+ 20*SCALE;  
            }
            else
            {
              var new_y = new_R * Math.sin(theta_x+Math.PI) + CIRCLE_CENTER_K ;
            }

            return new_y;
          })
          .attr("font-size", function() { return 15*SCALE +"px";})
          .attr("fill", "black")
          .attr("class", "text");
}