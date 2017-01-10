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




function numberNodes(x, y, n)
{
  MainContainer.append("text")
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
              var new_y = new_R * Math.sin(theta_x) + CIRCLE_CENTER_K;  
            }
            else
            {
              var new_y = new_R * Math.sin(theta_x+Math.PI) + CIRCLE_CENTER_K + 20*SCALE;
            }

            return new_y;
          })
          .text(function() { return n; })
          .attr("font-size", function() { return 15*SCALE +"px";})
          .attr("fill", "black")
          .attr("class", "text");
}