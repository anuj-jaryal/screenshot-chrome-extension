$(document).ready(function(){
    chrome.storage.local.get(['canvasImg'],function(res){
        var canvas = document.getElementById("image-canvas");
        var ctx = canvas.getContext("2d");

        $("#canvas-image").val(res.canvasImg);
        var img = new Image();
        img.src=res.canvasImg;
        img.onload=function(){
            var imgWidth=img.naturalWidth,
                imgHeight=img.naturalHeight;
                $('#image-canvas').attr('height',imgHeight).attr('width',imgWidth);
             ctx.drawImage(img, 0, 0);
        }

    });

 });

function CanvasDraw(canvas){
    this.strokeStyle='red';
    this.lineWidth=2;
    this.canvas=canvas;
    console.log(this.canvas.offsetLeft);
    this.ctx =this.canvas.getContext("2d");

    var shape='circle';
    var startDraw=false;
    var startX=0;
    var starY=0;
    var mouseX=0;
    var mouseY=0;
    var offsetX = 0;
    var offsetY = 0;

 

    this.drawShape=function(e){

        if(this.startDraw){
            switch(this.shape){
                case 'rect':
                    this.drawRectangle(e);
                    break;
                case 'circle':
                    this.drawCircle(e);
                    break;
                case 'line':
                    this.drawLine(e);
                    break;
                default:
                    break;
            }
        }else{
            console.log('enable start draw first');
        }
    }

    this.enableStartDraw=function(){
        this.startDraw=true;
    }

    this.disableStartDraw=function(){
        this.startDraw=false;
    }

    this.setShape=function(shape){
        this.shape=shape;
    }

    this.getShape=function(){
        return this.shape;
    }

    this.setMouseCord=function(e){
        this.mouseX = parseInt(e.clientX - this.offsetX);
        this.mouseY = parseInt(e.clientY - this.offsetY);
    }

    this.setOffsetCord=function(e){
        this.offsetX = this.canvas.offsetLeft;
        this.offsetY = this.canvas.offsetTop;
    }

    this.setStartCord=function(){
        this.startX=this.mouseX;
        this.startY=this.mouseY;
    }

    this.drawRectangle=function(e){
        console.log('rectangle drawn');
       
        console.log('oX :'+this.offsetX+' oY:'+this.offsetY);
        
        console.log('mX :'+this.mouseX+' mY:'+this.mouseY);
        
        console.log('sX :'+this.startX+' sY:'+this.startY);
    
        this.ctx.lineWidth=this.lineWidth;
        this.ctx.strokeStyle=this.strokeStyle;
        this.ctx.rect(this.startX, this.startY, this.mouseX-this.startX, this.mouseY-this.startY); 
        this.ctx.fill();
   
        
    }


    this.drawCircle=function(e){
        console.log('circle drawn');
        this.ctx.beginPath();
        this.ctx.arc(95,50,40,0,2*Math.PI);
        this.ctx.stroke();
    }

    this.drawLine=function(){
        console.log('line drawn');
        this.ctx.beginPath();
        this.ctx.moveTo(0,0);
        this.ctx.lineTo(200,100);
        this.ctx.stroke();
    }
    this.setStroke=function(){
        this.ctx.stroke();
    }

    this.setBeginPath=function(){
        this.ctx.beginPath();
    }
}

window.onload=function(){
    var canvas = document.getElementById("image-canvas");
    var rect      = document.getElementById('rect');
    var circle    = document.getElementById('circle');
    var line      = document.getElementById('line');
    var cd = new CanvasDraw(canvas);

    rect.addEventListener('click',function(){
        cd.setShape('rect');
        canvas.style.cursor="crosshair";
        console.log(cd.getShape());
    });

    circle.addEventListener('click',function(){
        cd.setShape('circle');
        console.log(cd.getShape());
    });

    line.addEventListener('click',function(){
        cd.setShape('line');
        console.log(cd.getShape());
    });

    canvas.addEventListener('mousedown',function(e){
        cd.setOffsetCord(e);
        cd.setMouseCord(e);
        cd.setStartCord(e);
        cd.enableStartDraw();
        cd.setBeginPath();
        cd.drawShape(e);
    });

    canvas.addEventListener('mouseup',function(e){
        cd.setMouseCord(e);
        cd.drawShape(e);
        cd.setStroke();
        cd.disableStartDraw();
    });

     canvas.addEventListener('mousemove',function(e){
        cd.setMouseCord(e);
        cd.drawShape(e);
        //cd.draw();
    });
}
