const express = require('express');
const bodyParser = require('body-parser');//so that we can access the data which we recieve from post request
const path = require('path'); //core module to deal with file paths (no need to install this module)
const nodemailer = require('nodemailer');

const app = express();

//View engine setup
app.set('view engine','ejs');

//css,client side js,images,assets are gonna be in the public folder. css folder is where our css for the form is gonna be
//Static folder
app.use('/public',express.static(path.join(__dirname,'public'))) //just defining the static folder as our public folder so it knows where to look(__dirname is the current directory)

//Body parser middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false})); //body parser middleware attaches the data on the post request to the req object (of the call back fn which runs when a request is 
//made to a route) as an object. It parses the data recieved into JSON (which is easy to deal with). Since the resultant data is json ie. key:value pairs - {extended:false} stores
//the value as string or array whereas, {extended:true} can store the value in any datatype.
//parse application/json
app.use(bodyParser.json());//does the same thing as above mentioned

app.get('/', (req,res)=>{
    res.render('contact',{msg:''});
})

app.post('/send',async(req,res)=>{
    //console.log(req.body)  //we can do this because we have used body-parser //this logs the form feilds to the console
    //this is the body of the email :
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Phone: ${req.body.phone}</li>
        <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message:</h3>
    <p>${req.body.message}</p>
    `;
    
  let transporter = nodemailer.createTransport({//configuration object passed to the function
    host: "smtp.gmail.com", //gmail Simple Mail Transfer Protocol (SMTP) setup 
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: '', // email address of gmail account from which the mail is to be sent
      pass: '', // password of gmail account from which the mail is to be sent
    },
    tls:{//since we are on our local host and not the domain we have mentioned as the (host) its rejecting us so we have pass this additional object as the property 
         //on the configuration object passed to the function
        rejectUnauthorized:false
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Node mailer" <guptasarthakdelhi2000@gmail.com>', // sender address
    to: "guptasarthakdelhi2000@gmail.com", // list of receivers (comma seperated email addresses)
    subject: "Node mailer", 
    text: "Hello world?", // plain text body
    html:output, // html body (we could do everything in the output string as the plain text body)
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  //what we want to do afterwards (once the form is submitted) (rendering the contact form with a message)
  res.render('contact',{msg:'email has been sent'});
  
  //main().catch(console.error);
})

app.listen(3000, ()=>{
    console.log('Server started');
})