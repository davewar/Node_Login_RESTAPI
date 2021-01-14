const express = require('express')
const bodyparser = require('body-parser')
const app = express()
const jwt =require('jsonwebtoken')

var cookieParser = require("cookie-parser");
var session = require("express-session");

require('dotenv').config()


const cors        = require('cors');
const fetch = require('node-fetch');


app.use(bodyparser.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.set('view engine', 'ejs')

app.use(cookieParser());

app.use(
  session({
    key: "user_sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 360000,
    },
  })
);
// 1000*60*6
// guide -  1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)


app.use((req, res, next) => {

  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect("/dashboard");
  } else {
    next();
  }
};



app.get("/", sessionChecker,(req, res)=>{

    res.redirect("/login");
})



app
  .route("/login")
  .get(sessionChecker,  (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
  })
  .post(async (req, res) => {
                // console.log("DW login");
                //  console.log("DW",req.body);
             const {username ,password} = req.body

            // fields not complete
            if (!username || !password) {
                return res.status(400).json({ msg: 'Please enter all fields' });
            }

    try{

          const url = "https://api.bybits.co.uk/auth/token";

          

           const bodyData = {
                username: username,
            password: password,
              type: "USER_PASSWORD_AUTH"
              }

            
          const resData = await fetch(url,{
                  method: "POST",
                  body: JSON.stringify(bodyData),
                  headers: {'Content-Type': 'application/json',
                        'environment': 'mock'}
          })

          const data = await resData.json()
            console.log("data",data);

            // no data or length is zero
            if(!data){
               return res.redirect("/login");
            }

            if(data.length===0){
               return res.redirect("/login");
            }

            // Bcypt - dont know salt number, unable to use this package

            // check if pw & username correct. Not required - I have made up usernames & pw and the API excepts anything.

                
           const id = data.access_token
          //  console.log("dw id",id);
              
            // res.json(data)
             req.session.user = id;
          
            res.redirect("/dashboard")

    }
    catch(err){
          console.log("DW ERR", err);
        res.json({ msg: err.message });

    }
            
     
  
  });   //end of post


  app
  .route("/dashboard")
  .get(async (req, res) => {
                // console.log("DW login");
    
      //
      if (req.session.user && req.cookies.user_sid) {
            //all gd
           
      } else {
        return res.redirect("/login");
      }
      //
          
    try{

          const url = "https://api.bybits.co.uk/policys/details";

          // const authID = "Bearer MuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0zX3JkdldSMGs";
          const authID = `Bearer ${req.session.user}`;
          // console.log(authID);
            
          const resData = await fetch(url,{
                  method: "GET",
                  Authorization: authID,
                  headers: {'Content-Type': 'application/json',
                        'environment': 'mock'}
          })

          const data = await resData.json()

             //  console.log(data);
            const {policy_ref,cover} = data.policy
            const {make,model,colour,reg} = data.vehicle
            const {line_1,line_2, postcode} = data.policy.address
            // console.log(policy_ref,cover)
            // console.log(make,model,colour,reg)
            // console.log(line_1,line_2,postcode)
            const address = `${line_1}, ${line_2}, ${postcode} `;
            const car = `${make} ${model} ${colour}-${reg} `;

            // let newObj = {
            //       "Policy reference": policy_ref,
            //       "Cover type": cover,
            //       "Car": car.charAt(0).toUpperCase()+car.slice(1),
            //       "Address": address,
            //     }

            // res.json(newObj)
                     res.render('dashboard.ejs', {
                       policy_ref,
                        address,
                        cover,
                        "car": car.charAt(0).toUpperCase()+car.slice(1),

                     })
        
       

    }
    catch(err){
          console.log("DW ERR", err);
        res.json({ msg: err.message });

    }
            
     
  
  });   //end of get

  app.get("/logout", (req, res) => {
  // console.log("logout",req.session);
  if (req.session.user && req.cookies.user_sid) {
    // req.session.user =""
    req.session.destroy();
    res.clearCookie("user_sid");
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

  //no path
app.use(function(req, res, next) {
  res.status(404).send('No page found');
});

const PORT = process.env.PORT || 5000;



let http = require('http');
http.createServer(app).listen(8080, () => {
    console.log('server up')
});;

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
 
  });
});