require('dotenv').config()
const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const app=express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
const mongoose=require('mongoose');
const encrypt = require('mongoose-encryption');
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
const secret=process.env.SECRET_KEY;
userSchema.plugin(encrypt, {secret: secret,encryptedFields: ['password']});

const User= new mongoose.model("User",userSchema)

app.post('/register', (req,res)=>{
    const newUser= new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save((err)=>{
        if (err){
            console.log(err)
        } else {
            res.render('secrets')
        }
    })
})

app.post('/login', (req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username}, (err,foundUser)=>{
       if (err){
           console.log(err)
       }else {
            if (foundUser){
                if (foundUser.password===password){
                    res.render('secrets')
                }
            }
        } 
})
});

app.get('/', (req,res)=>{
    res.render('Home')
})
app.get('/login', (req,res)=>{
    res.render('login')
})

app.get('/register', (req,res)=>{
    res.render('register')
})


app.listen(3000, ()=>{
    console.log('Server Started on Port 3000')
});
