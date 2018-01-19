(function(){
var canvas,
    context,
    shape='',
    lineWidth=5,
    dragging = false,
    cropDragging=false,
    isCrop = false,
    changeImage='',
    dragStartLocation,
    docrop=false,
    istakensnapshot=false,
    snapshot,
    cropSnapshot;


function getCanvasCoordinates(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

function getCropCanvasCoordinates(event) {
    var x = event.clientX - cropCanvas.getBoundingClientRect().left,
        y = event.clientY - cropCanvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

function takeSnapshot() {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapshot() {
    context.putImageData(snapshot, 0, 0);
}

function takeCropSnapshot() {
    cropSnapshot=cropContext.getImageData(0, 0, cropCanvas.width, cropCanvas.height);
}

function restoreCropSnapshot() {
    cropContext.putImageData(cropSnapshot, 0, 0);
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
    context.lineWidth=lineWidth;
    context.beginPath();
    context.moveTo(dragStartLocation.x, dragStartLocation.y);
    context.lineTo(position.x, position.y);
    context.stroke();
}

function drawCircle(position) {
    var radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2));
    context.lineWidth=lineWidth;
    context.beginPath();
    context.arc(dragStartLocation.x, dragStartLocation.y, radius, 0, 2 * Math.PI, false);
    fillOrStroke();
}


function drawRectangle(position){
    context.lineWidth=lineWidth;
    context.beginPath();
    rect.w = dragStartLocation.x - position.x ;
    rect.h = dragStartLocation.y - position.y ;
    context.rect(position.x, position.y, rect.w, rect.h);
    fillOrStroke();
    
}

function cropImage(position){

        //canvas.cropper();
        rect.w = dragStartLocation.x - position.x ;
        rect.h = dragStartLocation.y - position.y ;
        canvas.style.opacity=0.7;
        var sourceX = position.x;
        var sourceY = position.y;
        var sourceWidth = rect.w;
        var sourceHeight = rect.h;
        var destWidth = sourceWidth;
        var destHeight = sourceHeight;
        var destX = canvas.width / 2 - destWidth / 2;
        var destY = canvas.height / 2 - destHeight / 2;
       // context.rect(position.x, position.y, rect.w, rect.h);
       context.lineWidth=0;
        context.strokeRect(position.x, position.y, rect.w, rect.h);

        cropContext.drawImage(cropImg, sourceX, sourceY, sourceWidth, sourceHeight, position.x, position.y, destWidth, destHeight);     

}

function drawCrop(position){

    rect.w = dragStartLocation.x - position.x ;
    rect.h = dragStartLocation.y - position.y ;

    cropContext.clearRect(position.x, position.y, rect.w, rect.h);
    
}

function drawPaint(position){
    context.lineWidth=lineWidth;
    context.beginPath();
    context.lineTo(dragStartLocation.x, dragStartLocation.y);
    context.stroke();
    context.beginPath();
    context.arc(position.x,position.y,lineWidth/2, 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.moveTo(position.x,position.y);

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
    var canvasText;
    context.font = "30px Arial";
    canvasText=document.getElementById('canvas-text');
    canvasText.style.display='block';
    canvasText.style.left=(position.x+10)+'px';
    canvasText.style.top=(position.y+55)+'px';
    canvasText.setAttribute('autofocus',true);

    //context.strokeText(text,position.x,position.y);
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

function applyCropStyle(){
    //cropContext.fillStyle='#7FFFFFFF';
    cropContext.globalAlpha=0.3;
    cropContext.fillRect(0, 0, cropCanvas.width, cropCanvas.height);
}

function draw(position) {

    var fillBox = false;//document.getElementById("fillBox"),
        //shape = document.querySelector('input[type="radio"][name="shape"]:checked').value,
        //shape=document.getElementById('shape').value;
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
        drawPaint(position);
    }

    if(shape==="text55"){
        drawText(position);
    }

    if(shape==="crop"){          
        drawCrop(position);
    }

    if (shape === "polygon") {
        drawPolygon(position, polygonSides, polygonAngle * (Math.PI / 180));
    }
    
}

function triggerEvent(el, type){
   if ('createEvent' in document) {
        // modern browsers, IE9+
        var e = document.createEvent('HTMLEvents');
        e.initEvent(type, false, true);
        el.dispatchEvent(e);
    } else {
        // IE 8
        var e = document.createEventObject();
        e.eventType = type;
        el.fireEvent('on'+e.eventType, e);
    }
}

function dragStart(event) {
    console.log('canvas1 drage start');
    dragging = true;
    dragStartLocation = getCanvasCoordinates(event);
    console.log('canvas1:',dragStartLocation);
    console.log('canvas2:',getCropCanvasCoordinates(event));
    if(shape==="pencil"){
        addClick(dragStartLocation.x,dragStartLocation.y);
    }
    if(shape=="text"){
        drawText(dragStartLocation);
    }

    takeSnapshot();
    //cropImg.src=canvas.toDataURL('image/png');
    
    //changeImage=canvas.toDataURL('image/png');
}

function cropDragStart(event) {
    
    if(shape=='crop'){
        cropDragging = true;
        dragStartLocation = getCropCanvasCoordinates(event);
        console.log(dragStartLocation);
        cropContext.clearRect(0, 0, cropCanvas.width,cropCanvas.height);
        takeCropSnapshot();
    }else{
        dragStart(event);
    }
    //applyCropStyle();
}

function drag(event) {
    var position;
    if (dragging === true) {
        restoreSnapshot();
        position = getCanvasCoordinates(event);
        //console.log(position);
        if(shape=="pencil"){
            addClick(position.x,position.y,true);
        }
   
        draw(position);
    }
}

function cropDrag(event){

    if(shape=='crop'){
        var position;
        if(cropDragging ===true){
            restoreCropSnapshot();
            position = getCropCanvasCoordinates(event);
            console.log(position);
            applyCropStyle();
            draw(position);
        }
    }else{
        drag(event);
    }
}


function dragStop(event) {
    dragging = false;
    restoreSnapshot();
    var position = getCanvasCoordinates(event);
    draw(position);
    if(shape=='pencil'){
        context.beginPath();
    }
}

function cropDragStop(event){

    if(shape=='crop'){
        cropDragging = false;
        //restoreCropSnapshot();
        var position = getCropCanvasCoordinates(event);
        applyCropStyle();
        draw(position);
    }else{
        dragStop(event);
    }
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
    cropCanvas=document.getElementById('cropFrame');
    context = canvas.getContext('2d');
    cropContext = cropCanvas.getContext('2d');
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

    cropCanvas.addEventListener('mousedown', cropDragStart, false);
    cropCanvas.addEventListener('mousemove', cropDrag, false);
    cropCanvas.addEventListener('mouseup', cropDragStop, false);
    //lineWidth.addEventListener("input", changeLineWidth, false);
   // fillColor.addEventListener("input", changeFillStyle, false);
    //strokeColor.addEventListener("input", changeStrokeStyle, false);
    //canvasColor.addEventListener("input", changeBackgroundColor, false);
    for(var i=0;i< shapes.length;i++){
        shapes[i].addEventListener('click',function(){
            shape=this.getAttribute('id');
            if(shape=='crop'){
                cropCanvas.style.display='block';
            }
      
        },false);
    }
    chrome.storage.local.get(['canvasImg'],function(res){
        inputBase64=document.getElementById('inputbase64');
        inputBase64.value=res.canvasImg;
        img = new Image();
        cropImg=new Image();
        img.src=res.canvasImg;
        img.onload=function(){
            var imgWidth=img.naturalWidth,
                imgHeight=img.naturalHeight;
                canvas.setAttribute('height',imgHeight);
                canvas.setAttribute('width',imgWidth);
                cropCanvas.setAttribute('height',imgHeight);
                cropCanvas.setAttribute('width',imgWidth);
                context.drawImage(img, 0, 0);
        }

    });

    document.getElementById('color').addEventListener('change',function(event){
        context.strokeStyle =this.value;
        event.stopPropagation();
    },false);

    document.getElementById('range').addEventListener('change',function(event){
        lineWidth = Number(this.value);
        console.log(lineWidth);
        event.stopPropagation();
    },false);

    document.getElementById('clear').addEventListener('click',function(event){
        img.src=inputbase64.value;
        cropCanvas.style.display='none';
        shape='';
        clickX.length=0;
        clickY.length=0;
        clickDrag.length=0;
        canvas.style.opacity=1.0;
    },false);

    

}

window.addEventListener('load', init, false);

})();
