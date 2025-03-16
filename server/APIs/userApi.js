const exp=require('express')
const userApp=exp.Router();
const UserAuthor=require("../models/userAuthorModel")
const userOrAuthor=require("./userOrAuthor")
const expressasynchandler=require("express-async-handler")
const Article=require("../models/articleModel")
//create new user
userApp.post('/user',expressasynchandler(userOrAuthor))
//add comment
userApp.put('/comment/:articleId',expressasynchandler(async(req,res)=>{

    const commentObj=req.body;
    console.log(commentObj,req.params.articleId)
   const artcilewithcomment= await Article.findOneAndUpdate(
    {articleId:req.params.articleId},
    {$push:{comments:commentObj}},
    {returnOriginal:false})
    res.send({message:"comment added",payload:artcilewithcomment})
}))
module.exports=userApp;