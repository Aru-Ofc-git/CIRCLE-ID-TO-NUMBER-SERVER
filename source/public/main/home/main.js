// Close Profile Menu
$('#close').click(()=>{
    $('.profileInfo').slideToggle();

})
$('#show').click(()=>{
    $('.profileInfo').slideToggle();
})
// Focus Number Box
$('#number').on('focusin',function(){
    $('.numberText').addClass('numberFocus');
});
$('#number').on('focusout', function(){
    if (!this.value) {
        $('.numberText').removeClass('numberFocus'); 
    }
  });
$(document).ready(function(){
    var nameGEt = {
        "url": "http://localhost:3000/api/api-to-info",
        "method": "POST"
      };
      $.ajax(nameGEt).done((response)=>{
        var ppSrc = 'https://circle.robi.com.bd/mylife/appapi/image.php?size=L&nickname='+response.data.nickname;
        const nick_name = response.data.nickname;
        $('#profile').attr('src',ppSrc);
        $('.number').html('+'+response.data.msisdn);
        $('.nick').html(response.data.nickname);
        $('.name').html(response.data.name);
        $('.birthday').html(response.data.birthday);
        if(response.data.status_id == '1'){
            $('.status').html('Active');
        }else{
            $('.status').html('Inactive');
        }
      });
      var mkeyGet = {
        "url": "http://localhost:3000/mkey",
        "method": "POST"
      };
      $.ajax(mkeyGet).done(function (response) {
        console.log(response);
        $('#apiKey').val(response.mkey);
      });    
});
$('#copyAPI').click(()=>{
    var mkey = $('#apiKey');
    mkey.select();
    navigator.clipboard.writeText(mkey.val());
    $('#copyAPI').val("COPIED");
})


$('.submit').click(()=>{
  var number = $('#number').val();
  if(!number){
    alert("Enter Number or Circle ID.")
  }else{
    // $('.info_section').slideToggle();
    var settings = {
      "url": "http://localhost:3000/api/get-info?idOrNickname="+number,
      "method": "POST"
    };
    
    $.ajax(settings).done(function (response) {
      if(response.rdesc == "OK"){
        var ppSrc = 'https://circle.robi.com.bd/mylife/appapi/image.php?size=L&nickname='+response.data.nickname;
        $('#pp_image').attr('src',ppSrc);
        $('.number_info').html('+'+response.data.msisdn);
        $('.nickname_info').html(response.data.nickname);
        $('.name_info').html(response.data.name);
        $('.birthday_info').html(response.data.birthday);
        $('.points').html(response.data.points);
        $('.following').html(response.data.following);
        $('.followers').html(response.data.followers);
        $('.shout').html(response.data.updates);
        $('.comments').html(response.data.comments);
        $('.gender').html(response.data.gender);
        $('.language').html(response.data.language);
        $('.lastshout').html(response.data.mlstatus);
        $('.lastactive').html(response.data.timestamp);
        var data = JSON.stringify(response, null, 3);
        $("#infoVal").html(data)
        if(response.data.type === "0"){
          $('.appaccess').html("ON");
      }else{
        $('.appaccess').html("OFF");
      }
        $('.info_section').slideToggle();
        $("#copyJSON").click(()=>{
          var info = $('#infoVal');
          info.select();
          // info.setSelectionRange(0,90000000000000);
          navigator.clipboard.writeText(info.val());
          $("#copyJSON").html("COPIED");
        });
      }else if(response.rdesc == "Not found"){
        alert("Not Found.")
      }
    });

  }
})
$('#closeInfo').click(()=>{
  $('.info_section').slideToggle();
})

$("#logout").click(()=>{
  var settings = {
    "url": "http://localhost:3000/logout",
    "method": "POST",
    "timeout": 0,
  };
  
  $.ajax(settings).done(function (response) {
    console.log(response);
    if(response.message == "Logout Successful."){
      window.location = '/';
    }else{
      alert("Error");
    }
  });
})