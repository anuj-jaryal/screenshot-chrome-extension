$(document).ready(function(){
    
    function emptyValidate(value,error,name){
        if(value.trim()==""){
            error.text(name+" is required!");
            error.parent('div').addClass('has-error');
            return false;
        }else{
            error.text('');
            error.parent('div').removeClass('has-error');
            return true;
        }

    }

    //submit form
    $("#image-form").submit(function(e){
        e.preventDefault();
  
        var that=$(this);
        var data={};
        var action = that.attr('action');
        var method = that.attr('method');
        that.find('input[name],textarea[name]').each(function(){
            var name = $(this).attr('name');
            var value = $(this).val();   
             data[name]=value;
        });
        data['attachment']=$('.site-wrapper').contents().find('iframe').contents().find('#canvas-image').val();
    
        isValidTitle=emptyValidate(data['title'],$("#title-error"),"Title");
        isValidDesc=emptyValidate(data['description'],$("#desc-error"),"Description");

        if((isValidTitle===true) && (isValidDesc===true) ){
            $.ajax({
                url:action,
                type:method,
                data:data,
                success:function(res){
                    if(res){
                        $('#response').empty();
                        $("#response").append('<div class="alert alert-success">Record inserted successfully!\nYour Ticket id is :'+res.last_id+'</div>');
                    }
                }
            });
        }else{
            console.log("not passed");
        }
       // console.log(data);
    });
});