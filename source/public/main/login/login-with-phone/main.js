// Focus Number Box
$('#number').on('focusin',function(){
    $('.numberText').addClass('activePhone');
});
$('#number').on('focusout', function(){
    if (!this.value) {
        $('.numberText').removeClass('activePhone'); 
    }
  });
// Focus OTP
// Focus Number Box
$('#otp').on('focusin',function(){
    $('.otpText').addClass('activeOTP');
});
$('#otp').on('focusout', function(){
    if (!this.value) {
        $('.otpText').removeClass('activeOTP'); 
    }
  });
$(".sendOTP").click(()=>{
    var number = $("#number");
    if(!number.val()){
        alert("Please Enter Number");
    }else{
        var settings = {
            "url": "http://localhost:3000/sentOtp?number="+number.val(),
            "method": "POST"
          };
          $.ajax(settings).done(function (response) {

            if(response.rdesc == "OK"){
               $("#sendOTP").hide();
            }else if(response.rdesc == "App installation not allowed because user account is strictly SMS ONLY."){
               alert("Please Enable APP Access");
            }else if(response.rdesc == "You have send too much request"){
                alert("Please try again 24 hours letter.");
             }else{
                alert("Invalid Number");
             }
          });
    }
})
$(".submit").click(()=>{
    var number = $("#number").val();
    var otp = $("#otp").val();
    if(!number){
        alert("Number Feild Empty")
    }else{
        if($("#sendOTP").css("display") == "inline-block"){
            alert("Please Sent OTP")
        }else{
            var settings = {
                "url": "http://localhost:3000/otp-verify?number="+number+"&otp="+otp,
                "method": "POST",
                "timeout": 0,
              };
              $.ajax(settings).done(function (response) {
                console.log(response);
                if(response.statusCode == 400){
                    alert(response.message);
                    console.log(response)    
                        }else{
                            var urlGo = "http://localhost:3000/home";
                            console.log(response);
                            window.location = urlGo;
                        };
              });
        }
    }
})