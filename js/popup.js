
$(document).ready(function(){
 

   // $(document).on('click','#full-screen',function(){
   //      chrome.tabs.captureVisiblePage(null,{'format':'png'},function(image){

              
   //               chrome.storage.local.set({'canvasImg': image}, function(){
                    
   //               });
   //          });
   //    //  });


   //      chrome.tabs.create({'url': chrome.extension.getURL('index.html')},function(tab) {
   //          console.log(tab);
   //      });

  
   //  });

   // $(document).on('click','#visible-part',function(){
   //      chrome.tabs.captureVisibleTab(null,{'format':'png'},function(image){
       
   //          chrome.storage.local.set({'canvasImg': image}, function(){
                
   //          });
   //      });

   //      chrome.tabs.create({'url': chrome.extension.getURL('index.html')},function(tab) {
   //          console.log(tab);
   //      });

  
   //  });


    

    chrome.storage.local.get(['canvasImg'],function(res){
        $("#canvas-image").val(res.canvasImg);
        var img = new Image();
        img.src=res.canvasImg;
        img.onload=function(){
            var imgWidth=img.naturalWidth,
                imgHeight=img.naturalHeight;
                console.log(imgWidth,'::',imgHeight);
                $('#wPaint').css({
                    width: imgWidth,
                    height: imgHeight
                })
                .wPaint('resize');
        }
         //$(window).resize();
        $("#wPaint").wPaint({
            menuOffsetLeft: '25%',
            menuOffsetTop: '5px',
            fillStyle: 'transparent',
            strokeStyle:'#0000FF', 
            image:res.canvasImg,
            onShapeMove: function (e) {
             $("#canvas-image").val($("#wPaint").wPaint("image"));
            }
        });

    });

        // $(document).on('click','#crop',function(){
        //     $("#wPaint canvas").cropper();
        // });


 });
