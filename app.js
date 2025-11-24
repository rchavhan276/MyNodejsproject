const express = require('express');
const morgan = require('morgan');
const app = express()
const userModel = require('./models/user')
const connectToDB = require('./config/db')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')  // to encrypt the plain password into hash
const jwt = require('jsonwebtoken') // to create the jsonwebtoken

// ....................................................Middleware

app.use(morgan('dev'))     // middleware debugger
app.use(express.json())    
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))         // this tool is used for static css page definetion under this you need to allow the public folder.
dotenv.config()   // dotenv package used for creting enviornment variable for values
connectToDB();  // extra line for calling dbconnection function
// ......................................................for non-html page 




// app.get("/profile",(req,res)=>{
//     res.end("This is my profile")
// })

// app.get("/slides",(req,res)=>{
//     res.end("This is slide page")
// })

// app.listen(3000)


// .......................................................for html pages

app.set("view engine","ejs")


app.get("/",(req,res)=>{
    res.render("Registrationform-index.ejs")
})
app.get("/login",(req,res)=>{
    res.render("login-index.ejs")
})
//........form the get data shows in url
// app.get("/get-data",(req,res)=>{
//     console.log(req.query)  //....for get you need to use req.query
//     res.render("done.ejs")
// })


// if you are using post method to not shows data in url you must enable the extension above 
app.post("/register", async (req,res)=>{   // async operation is used for syncing for creation of user
    console.log(req.body)    //......for post you need to use req.body
    const { username, email, password, gender } = req.body

    const hashPassword = await bcrypt.hash(password, 10)    // converting plan password into hash and number rotation will be 10
    
        await userModel.create({                            //create user
        username: username, 
        email: email,
        password: hashPassword,
        gender: gender
    })  
    res.render("done.ejs")   
})

app.post("/login", async (req,res)=>{
    console.log(req.body)
    const { email, password } = req.body;
try {
    const user = await userModel.findOne({ email })
    console.log("User found:", user);
    if (!user) {
        return res.render("usernotfound.ejs") 
    }
    console.log("Password entered:", password);
    console.log("Password in DB:", user.password);
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return  res.render("incorrect.ejs")
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    // res.json({ token });
    res.render("dashboard-login.ejs")
} catch (error) {
    console.error("Login error:", error);
    res.status(500).send(" Server error during login");
}
    
})

app.get("/clear-users", async (req, res) => {
  await userModel.deleteMany({});
  res.send("Cleared all users.");
})

app.get("/get-user",(req, res)=>{                   //to find users in databases if we didn't provide condition then returns all users
    userModel.find({
        email: "rahul.cavhan@commtelnetworks.ai"
    }).then((users)=>{
        res.send(users)
    })
})

app.get("/update-user", async (req, res)=>{   //update user
    await userModel.findOneAndUpdate({
        username : "mehul"
    },{
        email: "mehul@cdf.com"
    })

    res.render("update.ejs")
})

app.get("/delete-user", async (req,res)=>{  //delete user
    await userModel.findOneAndDelete({
        email : "mehul@cdf.com"
    })

    res.render("delete.ejs")
})



// app.post("/login", (req, res) => {
//   res.send("POST /test works");
// });


app.listen(3000)

