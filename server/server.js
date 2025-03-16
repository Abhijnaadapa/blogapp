const exp=require("express")
const app=exp();
require('dotenv').config();
const port=process.env.PORT || 4000;


const mongoose=require('mongoose');
const userApp = require("./APIs/userApi");
const authorApp = require("./APIs/AuthorApi");
const adminApp = require("./APIs/adminApi");
const cors=require('cors')



//db connection
app.use(cors())

//body parser middleware
app.use(exp.json())
//connect api routes
app.use('/user-api',userApp)
app.use('/author-api',authorApp)
app.use('/admin-api',adminApp)
mongoose.connect(process.env.DBURL)
.then(()=>{
    app.listen(port,()=>console.log(`server listening on port ${port}..`))
    console.log("DB connection success")
})
.catch(err=>console.log("Error in DB connection",err))

//error handler
app.use((err,req,res,next)=>{
    console.log("err object in express error hadler :",err);
    res.send({message:err.message})
})

