function CanvasDraw(canvas){
    var strokeStyle='red';
    var lineWidth=2;
    var canvas=canvas;
    var ctx =this.canvas.getContext("2d");

    var shape='circle';
    var startDraw=false;

    var fillStyle='transparent';
    var drag=false;
    var rect={};

 

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
    this.getCanvas=function(){
        return this.canvas;
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
        this.ctx.fillStyle=this.fillStyle; 
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