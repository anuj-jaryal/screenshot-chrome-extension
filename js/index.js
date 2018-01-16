var canvas,
    context,
    dragging = false,
    dragStartLocation,
    snapshot;


function getCanvasCoordinates(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

function takeSnapshot() {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapshot() {
    context.putImageData(snapshot, 0, 0);
}

function fillOrStroke(){
  //  if (fillBox.checked) {
    if (false) {
        context.fill();
    } else {
        context.stroke();
    }
}

function drawLine(position) {
    context.beginPath();
    context.moveTo(dragStartLocation.x, dragStartLocation.y);
    context.lineTo(position.x, position.y);
    context.stroke();
}

function drawCircle(position) {
    var radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2));
    context.beginPath();
    context.arc(dragStartLocation.x, dragStartLocation.y, radius, 0, 2 * Math.PI, false);
    fillOrStroke();
}


function drawRectangle(position){
    context.beginPath();
    rect.w = dragStartLocation.x - position.x ;
    rect.h = dragStartLocation.y - position.y ;
    context.rect(position.x, position.y, rect.w, rect.h);
    fillOrStroke();
    
}

function cropImage(position){

        rect.w = dragStartLocation.x - position.x ;
        rect.h = dragStartLocation.y - position.y ;
         //context.globalCompositeOperation = "destination-over";
        context.beginPath();
        img.style.clip='rect('+position.x+','+position.y+','+rect.w+','+rect.h+')';
        //context.stroke();
        

}

function drawPencil(position){
    for(var i=0; i < clickX.length; i++) {     
        context.beginPath();
        if(clickDrag[i] && i){
          context.moveTo(clickX[i-1], clickY[i-1]);
         }else{
           context.moveTo(clickX[i]-1, clickY[i]);
         }
         context.lineTo(clickX[i], clickY[i]);
         context.closePath();
         context.stroke();
  }
}

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();

function addClick(x ,y ,dragging){
    
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);

}

function drawText(position){
    context.font = "30px Arial";
    text=document.getElementById('canvas-text').value;
    context.strokeText(text,position.x,position.y);
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
        text=document.getElementById('canvas-text').value;
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
}


function drawPolygon(position, sides, angle) {
    var coordinates = [],
        radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2)),
        index = 0;

    for (index = 0; index < sides; index++) {
        coordinates.push({x: dragStartLocation.x + radius * Math.cos(angle), y: dragStartLocation.y - radius * Math.sin(angle)});
        angle += (2 * Math.PI) / sides;
    }

    context.beginPath();
    context.moveTo(coordinates[0].x, coordinates[0].y);
    for (index = 1; index < sides; index++) {
        context.lineTo(coordinates[index].x, coordinates[index].y);
    }

    context.closePath();
}

function draw(position) {

    var fillBox = false;//document.getElementById("fillBox"),
        //shape = document.querySelector('input[type="radio"][name="shape"]:checked').value,
        shape=document.getElementById('shape').value;
       // polygonSides = document.getElementById("polygonSides").value,
       // polygonAngle = document.getElementById("polygonAngle").value,
       // lineCap = document.querySelector('input[type="radio"][name="lineCap"]:checked').value;

    context.lineCap = 1;//lineCap;

    if (shape === "circle") {
        canvas.style.cursor="crosshair";
        drawCircle(position);
    }
    if (shape === "line") {
        canvas.style.cursor="pointer";
        drawLine(position);
    }

    if(shape ==="rect"){
        canvas.style.cursor="crosshair";
        drawRectangle(position);
    }

    if(shape==="pencil"){
        canvas.style.cursor='pointer';
        drawPencil(position);
    }

    if(shape==="text"){
        drawText(position);
    }

    if(shape==="crop"){
        cropImage(position);
    }

    if (shape === "polygon") {
        drawPolygon(position, polygonSides, polygonAngle * (Math.PI / 180));
    }
    
}

function dragStart(event) {
    dragging = true;
    dragStartLocation = getCanvasCoordinates(event);
    if(document.getElementById('shape').value==="pencil"){
        addClick(dragStartLocation.x,dragStartLocation.y);
    }
    takeSnapshot();
}

function drag(event) {
    var position;
    if (dragging === true) {
        restoreSnapshot();
        position = getCanvasCoordinates(event);
        if(document.getElementById('shape').value==="pencil"){
            addClick(position.x,position.y,true);
        }
        draw(position);
    }
}


function dragStop(event) {
    dragging = false;
    restoreSnapshot();
    var position = getCanvasCoordinates(event);
    draw(position);
}

// function changeLineWidth() {
//     context.lineWidth = this.value;
//     event.stopPropagation();
// }

function changeFillStyle() {
    context.fillStyle = this.value;
    event.stopPropagation();
}

// function changeStrokeStyle() {
//     context.strokeStyle = this.value;
//     event.stopPropagation();
// }

function changeBackgroundColor() {
    context.save();
    context.fillStyle = document.getElementById("backgroundColor").value;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
}

function fillInput(event){
    document.getElementById('canvas-text').value+=event.key;
}

function init() {
    canvas = document.getElementById("image-canvas");
    context = canvas.getContext('2d');
    var lineWidth = document.getElementById("lineWidth"),
        fillColor = document.getElementById("fillColor"),
        strokeColor = document.getElementById("strokeColor"),
        canvasColor = document.getElementById("backgroundColor");
        shapes=document.querySelectorAll('.shapes');


   // context.strokeStyle = strokeColor.value;
    //context.fillStyle = fillColor.value;
   // context.lineWidth = lineWidth.value;


    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);
    document.addEventListener('keydown',fillInput,false);
    //lineWidth.addEventListener("input", changeLineWidth, false);
   // fillColor.addEventListener("input", changeFillStyle, false);
    //strokeColor.addEventListener("input", changeStrokeStyle, false);
    //canvasColor.addEventListener("input", changeBackgroundColor, false);
    for(var i=0;i< shapes.length;i++){
        shapes[i].addEventListener('click',function(){
            document.getElementById('shape').value=this.getAttribute('id');
            console.log(this.getAttribute('id'));
        },false);
    }
    chrome.storage.local.get(['canvasImg'],function(res){
        inputBase64=document.getElementById('inputbase64');
        inputBase64.value=res.canvasImg;
        img = new Image();
        img.src=res.canvasImg;
        img.onload=function(){
            var imgWidth=img.naturalWidth,
                imgHeight=img.naturalHeight;
                canvas.setAttribute('height',imgHeight);
                canvas.setAttribute('width',imgWidth);
                context.drawImage(img, 0, 0);
        }

    });

    document.getElementById('color').addEventListener('change',function(event){
        context.strokeStyle =this.value;
        event.stopPropagation();
    },false);

    document.getElementById('range').addEventListener('change',function(event){
        context.lineWidth =this.value;
        event.stopPropagation();
    },false);

    document.getElementById('clear').addEventListener('click',function(event){
        img.src=inputbase64.value;
        clickX.length=0;
        clickY.length=0;
        clickDrag.length=0;
    },false);

}

window.addEventListener('load', init, false);

