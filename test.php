<!DOCTYPE html>
<html>
<head>
    <title></title>
    <script src="js/jquery.min.js" type="text/javascript"></script>
</head>
<body>
<div id='sel'>
<canvas style="border:1px solid black;" id="source" height="600" width="700"></canvas></div>
</body>
<script type="text/javascript">

$('document').ready( function(){
const divOffset = 1
var x1,x2,y1,y2, xDif, yDif = 0;
var isSelection, 
    isBottomRight, 
    isTopRight, 
    isTopLeft, 
    isBottomLeft = false

var r = document.getElementById('source').getBoundingClientRect();
var pos = [0, 0];
pos[0] = r.left; 
pos[1] = r.top; //got position coordinates of canvas

var sel = document.getElementById('sel')
var canvasSource = document.getElementById("source");
var ctxSource = canvasSource.getContext("2d"); 

var img = new Image()
img.src = "images/download.png";
img.onload = function(){
  ctxSource.drawImage(img, 0, 0)
}

$( "#source" ).mousedown(function(event) {
   isSelection = true

   x1 = event.pageX - pos[0]
   y1 = event.pageY - pos[1]

   sel.style.setProperty('display', 'block')

   sel.style.setProperty('left', event.pageX + "px")
   sel.style.setProperty('top', event.pageY + "px")

   sel.style.setProperty('width', '0px')
   sel.style.setProperty('height', '0px')
});

$( "#source" ).mouseup(function(event) {
   isSelection = false
   if(isBottomRight){
     x2 = event.pageX - pos[0]
     y2 = event.pageY - pos[1]

     xDif = x2-x1
     yDif = y2-y1 
   } else if (isBottomLeft){
     y2 = event.pageY - pos[1]
     yDif = y2 - y1 

     xDif = x1 - x2
     x1 = x1 - xDif

   } else if(isTopRight){
     x2 = event.pageX - pos[0]
     xDif = x2 - x1 
     yDif = y1 - y2
     y1 = y1 - yDif         
   } else if (isTopLeft){
     xDif = x1 - x2
     x1 = x1 - xDif
     yDif = y1 - y2
     y1 = y1 - yDif         
   }
   sel.style.setProperty('display', 'none')
   crop(x1, y1, xDif, yDif)
});

$('#source').mousemove(function(event){
  if(isSelection){
    x2 = event.pageX - pos[0]
    y2 = event.pageY - pos[1]
    if(x2>x1 && y2>y1){ //moving right bottom selection
      isBottomRight = true
      isBottomLeft = false
      isTopLeft = false
      isTopRight = false

      xDif = x2 - x1
      yDif = y2 - y1 

      sel.style.setProperty('width', xDif + 'px')
      sel.style.setProperty('height', yDif + 'px')
    } else if(x2<x1 && y2>y1){ //moving left bottom selection
      isBottomLeft = true
      isTopLeft = false
      isTopRight = false
      isBottomRight = false

      xDif = x1 - x2
      yDif = y2 - y1 

      sel.style.setProperty('left', x2 + 'px')
      sel.style.setProperty('width', xDif + 'px')
      sel.style.setProperty('height', yDif + 'px')

    } else if(x2>x1 && y2<y1){
      isTopRight = true
      isTopLeft = false
      isBottomLeft = false
      isBottomRight = false

      xDif = y1 - y2
      yDif = x2 - x1 

      sel.style.setProperty('top', y2 + 'px')
      sel.style.setProperty('width', yDif + 'px')
      sel.style.setProperty('height', xDif + 'px')
    } else if (x2<x1 && y2<y1){
      isTopLeft = true
      isTopRight = false
      isBottomLeft = false
      isBottomRight = false

      yDif = y1 - y2 
      xDif = x1 - x2

      sel.style.setProperty('left', x2 + pos[0] + divOffset + 'px')
      sel.style.setProperty('top', y2 + pos[1] + divOffset + 'px')
      sel.style.setProperty('width', xDif  + 'px')
      sel.style.setProperty('height', yDif  + 'px')
    }
 }
})

function crop(x, y, xDif, yDif){
    canvasSource.width = xDif
    canvasSource.height = yDif
    ctxSource.drawImage(img, x, y, xDif, yDif, 0, 0, xDif, yDif);
}

})
</script>
</html>