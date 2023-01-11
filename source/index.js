const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const axios = require('axios');
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static('public/main'))
app.use(express.static('public/main/login'))
app.use(express.static('public/main/login/main.js'))

// Home Route
app.get("/",(req,res)=>{
    // res.setHeader('x-app-key','000oc0so48owkw4s0wwo4c00g00804w80gwkw8kg');
    res.cookie('appKey','000oc0so48owkw4s0wwo4c00g00804w80gwkw8kg',{maxAge: 9000000, httpOnly: true})

    var appKey = req.cookies.appKey;
    var apiKey = req.cookies.apiKey;
    if(appKey == "000oc0so48owkw4s0wwo4c00g00804w80gwkw8kg"){
        if( !apiKey ){
        res.sendFile(__dirname+'/public/main/login/login.html')
        }else{
            res.redirect("/home")
        }
    }else{
        res.sendFile(__dirname+'/public/main/login/login.html')
    }
})

// login route

app.get("/login/with-phone",(req,res)=>{
    var appKey = req.cookies.appKey;
    var apiKey = req.cookies.apiKey;
    if(appKey != "000oc0so48owkw4s0wwo4c00g00804w80gwkw8kg" || !apiKey ){
        res.sendFile(__dirname+'/public/main/login/login-with-phone/index.html');
    }else{
       res.redirect('/home');
    }
});
app.get("/login/with-api",(req,res)=>{
    var appKey = req.cookies.appKey;
    var apiKey = req.cookies.apiKey;
    if(appKey != "000oc0so48owkw4s0wwo4c00g00804w80gwkw8kg" || !apiKey ){
        res.sendFile(__dirname+'/public/main/login/login-with-api/index.html');
    }else{
       res.redirect('/home');
    }
});

app.get("/home",(req,res)=>{
    var appKey = req.cookies.appKey;
    var apiKey = req.cookies.apiKey;
    if(appKey == "000oc0so48owkw4s0wwo4c00g00804w80gwkw8kg"){
        if( !apiKey ){
            res.redirect("/");
        }else{
            res.sendFile(__dirname+'/public/main/home/home.html')
        }
    }else{
        res.redirect("/");
    }
});



// send file
app.get('/home/css',(req,res)=>{
    res.sendFile(__dirname+'/public/main/home/style.css')
})
app.get('/home/js',(req,res)=>{
    res.sendFile(__dirname+'/public/main/home/main.js')
})

app.get('/login/phone/css',(req,res)=>{
    res.sendFile(__dirname+'/public/main/login/login-with-phone/style.css')
})
app.get('/login/phone/js',(req,res)=>{
    res.sendFile(__dirname+'/public/main/login/login-with-phone/main.js')
})
app.get('/login/api/css',(req,res)=>{
    res.sendFile(__dirname+'/public/main/login/login-with-api/style.css')
})
app.get('/login/api/js',(req,res)=>{
    res.sendFile(__dirname+'/public/main/login/login-with-api/main.js')
})
app.get('/jQuery',(req,res)=>{
    res.sendFile(__dirname+'/public/main/jQuery/jQuery.js')
})

// api
app.post('/api/api-to-info',(req,res)=>{
    var appKey = req.cookies.appKey;
    var apiKey = req.cookies.apiKey;
    var url = 'https://circle.robi.com.bd/mylife/appapi/appcall.php?op=getUser';
    var headers = {
        'x-app-key':appKey,
        'x-api-key':apiKey
    }
    axios.post(url,{},{headers:headers})
    .then(function (response) {
          res.json(response.data);
          // res.send();
        })
}); 

app.post('/api/get-info',(req,res)=>{
    var id = req.query.idOrNickname;
    var appKey = req.cookies.appKey;
    var apiKey = req.cookies.apiKey;
    var headers = {
            'x-app-key':appKey,
            'x-api-key':apiKey
        }
        if(isNaN(id))
        {
            var url = "https://circle.robi.com.bd/mylife/appapi/appcall.php?op=getUserInfobyNickname&nickname="+id;
        }
        else
        {
            var url = "https://circle.robi.com.bd/mylife/appapi/appcall.php?op=getUserInfo&msisdn=88"+id;
        };
    axios.post(url,{},{headers:headers})
        .then(function (resP) {
            res.json(resP.data);
            // res.send();
        });
});

app.post('/mkey',(req,res)=>{
    var mkey = req.cookies.apiKey;
    var resp = {
        "mkey":mkey
    }
    res.json(resp);
});

app.post("/sentOtp",(req,res)=>{
    var number = req.query.number;
    var appKey = req.cookies.appKey;
    if(!number){
        res.json({
            "message":"Please Enter Numer"
        })

    }else{
    var url = 'https://circle.robi.com.bd/mylife/appapi/appcall.php?op=getOTC&pin=21799&app_version=78&msisdn=88'+number;
    var headers = {
        'x-app-key': appKey
    }
    axios.post(url,{},{headers:headers})
    .then(function (response) {
          res.json(response.data);
          // res.send();
        })}
})
app.post("/otp-verify",(req,res)=>{
    var otp = req.query.otp;
    var number = req.query.number;
    var appKey = req.cookies.appKey;
    
    if(!otp || !number){
        res.json({
            "message":"Please Enter OTP/Number"
        })

    }else{
    var url = 'https://circle.robi.com.bd/mylife/appapi/appcall.php?op=validateOTC&pin=12345&otc='+otp+'&app_version=79&msisdn=88'+number;
    var headers = {
        'x-app-key': appKey
    }
    axios.post(url,{},{headers:headers})
    .then(function (response) {
          if(response.data.rdesc == "OK"){
                var mkey = response.data.data.mkey;
                res.cookie('apiKey',mkey,{maxAge: 9000000, httpOnly: true});
                res.json(response.data);
          }else{
            res.json({
                "message" : response.data.rdesc,
                "login" : false,
                "statusCode" : 400
            });
          }
        })}

});
app.post('/apiValidation',(req,res)=>{
    var mkey = req.body.mkey;
    var appKey = req.cookies.appKey;
    var url = 'https://circle.robi.com.bd/mylife/appapi/appcall.php?op=getUser';
    var headers = {
        'x-app-key':appKey,
        'x-api-key':mkey
    }
    axios.post(url,{},{headers:headers})
    .then(function (response) {
        if(response.data.rdesc == "Unauthorized access"){
            res.json({
                "message" : "Invalid Mkey",
                "login" : false,
                "statusCode" : 400
            });
        }else{
            res.cookie('apiKey',mkey);
            res.json({
                "message" : "Mkey is Valid",
                "login" : true,
                "statusCode" : 200
            })
        }
        })
    
});
app.post("/logout",(req,res)=>{
    res.clearCookie("apiKey");
    res.json({
        "message":"Logout Successful."
    })
});
app.listen(3000,()=>{
    console.log("Server is running at http://localhost:3000/ ,  please visit this url from any browser on your device")
})