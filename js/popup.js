window.onload=function(){
    chrome.storage.local.get(['canvasImg'],function(res){
        var canvas = document.getElementById("image-canvas");
        var ctx = canvas.getContext("2d");
        inputBase64=document.getElementById('inputbase64');
        inputBase64.value=res.canvasImg;
        img = new Image();
        img.src=res.canvasImg;
        img.onload=function(){
            var imgWidth=img.naturalWidth,
                imgHeight=img.naturalHeight;
                canvas.setAttribute('height',imgHeight);
                canvas.setAttribute('width',imgWidth);
                ctx.drawImage(img, 0, 0);
        }

    });


    var rectangle = document.getElementById('rect');
    rectangle.addEventListener('click',function(){
        var prevRect={};
        var canvas = document.getElementById('image-canvas'),
        ctx = canvas.getContext('2d'),
        rect = {},
        drag = false;

        function init() {  
              canvas.addEventListener('mousedown', mouseDown, false);
              canvas.addEventListener('mouseup', mouseUp, false);
              canvas.addEventListener('mousemove', mouseMove, false);
        }

        function mouseDown(e) {
          rect.startX = e.pageX - this.offsetLeft;
          rect.startY = e.pageY - this.offsetTop;
          drag = true;
        }

        function mouseUp() {

          drag = false;
          img.src=canvas.toDataURL('image/png');
          ctx.clearRect(0,0,canvas.width,canvas.height);
          
        }

        function mouseMove(e) {
          if (drag) {
            rect.w = (e.pageX - this.offsetLeft) - rect.startX;
            rect.h = (e.pageY - this.offsetTop) - rect.startY ;
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(img, 0, 0);
            draw();
          }
        }

        function draw() {
          ctx.beginPath();
          ctx.rect(rect.startX, rect.startY, rect.w, rect.h);
          ctx.lineWidth=6;
          ctx.stroke();
        }

        init();

    });// end of  rectangle 

    //start of line
    var line=document.getElementById('line');
    line.addEventListener('click',function(){

        var canvas = document.getElementById("image-canvas");
        var ctx = canvas.getContext("2d");
        var canvasOffset = $("#image-canvas").offset();
        var offsetX = canvasOffset.left;
        var offsetY = canvasOffset.top;
        var storedLines = [];
        var startX = 0;
        var startY = 0;
        var isDown;

        ctx.strokeStyle = "orange";
        ctx.lineWidth = 3;

        $("#image-canvas").mousedown(function (e) {
            handleMouseDown(e);
        });
        $("#image-canvas").mousemove(function (e) {
            handleMouseMove(e);
        });
        $("#image-canvas").mouseup(function (e) {
            handleMouseUp(e);
        });

        $("#clear").click(function () {
            storedLines.length = 0;
            redrawStoredLines();
        });

        function handleMouseDown(e) {
            var mouseX = parseInt(e.clientX - offsetX);
            var mouseY = parseInt(e.clientY - offsetY);

            isDown = true;
            startX = mouseX;
            startY = mouseY;

        }

        function handleMouseMove(e) {

            if (!isDown) {
                return;
            }

            redrawStoredLines();

            var mouseX = parseInt(e.clientX - offsetX);
            var mouseY = parseInt(e.clientY - offsetY);

            // draw the current line
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke()

        }


        function handleMouseUp(e) {

            isDown = false;

            var mouseX = parseInt(e.clientX - offsetX);
            var mouseY = parseInt(e.clientY - offsetY);

            storedLines.push({
                x1: startX,
                y1: startY,
                x2: mouseX,
                y2: mouseY
            });

            redrawStoredLines();

        }


        function redrawStoredLines() {

            ctx.clearRect(0,0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            if (storedLines.length == 0) {
                return;
            }

            // redraw each stored line
            for (var i = 0; i < storedLines.length; i++) {
                ctx.beginPath();
                ctx.moveTo(storedLines[i].x1, storedLines[i].y1);
                ctx.lineTo(storedLines[i].x2, storedLines[i].y2);
                ctx.stroke();
            }
        }

    });//end of line
 };// end of window onload
