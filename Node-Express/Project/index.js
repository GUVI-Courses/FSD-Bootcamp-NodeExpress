const express = require('express')
const mongoose = require('mongoose');
const bodyParser= require('body-parser')
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken');

const app = express()
const port=3000
const secret='GUVU545484@^$%4'


// Middleware
app.use(bodyParser.json())



// Mongodb connection
mongoose.connect('mongodb://localhost:27017/testing',{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>console.log("MongoDb is connected boss....")).catch(err=>console.log(err))




// Define a simple schema
const ItemSchema= new mongoose.Schema({
    name:String,
    quantity:Number
})

const Items=mongoose.model("Items",ItemSchema)


// User Schema Model
const UserSchema = new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
})

UserSchema.pre('save',async function(next){
    if(this.isModified('password')|| this.isNew){
        const salt= await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt)
    }
    next()
})


UserSchema.methods.comparePassword = function (password){
    return bcrypt.compare(password,this.password)
}



const User=mongoose.model("User",UserSchema)

// Authentication Middleware

const auth =(req,res,next)=>{
    const token=req.header('Authorization').replace('Bearer ','')
    try{
        const decoded=jwt.verify(token,secret);
        req.user=decoded;
        next()
    }
    catch(e){
        res.status(401).send({error:'Please Authenticate'})
    }
}



// Routes
app.post('/register',async(req,res)=>{
    const user = new User(req.body)
    await user.save();
    res.status(201).send(user)
})


app.post('/login',async(req,res)=>{
    const {username,password}=req.body
    const user=await User.findOne({username});
    if(!user || !(await user.comparePassword(password))){
        return res.status(401).send({error:"Invalid Login Credentials..."})
    }
    const token=jwt.sign({_id:user._id,username:user.username},secret,{expiresIn:'1h'});
    res.send({token})
})

app.get('/protected', auth, (req,res)=>{
    res.send({message:"This is protected routes"})
})
















app.get('/', function (req, res) {
  res.send('Hello World')
})

// get the items
app.get("/items",async(req,res)=>{
    const items= await Items.find();
    res.json(items)
})
// Post the items
app.post("/items",async(req,res)=>{
    const newItem=new Items(req.body);
    await newItem.save();
    res.json(newItem)
})

app.listen(port,()=>{
    console.log(`Server is running at the port http://localhost:${port}`)
})