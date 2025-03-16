const exp=require('express')
const authorApp=exp.Router();
const userOrAuthor=require("./userOrAuthor")
const Article=require("../models/articleModel")
const expressasynchandler=require("express-async-handler")
const {requireAuth,clerkMiddleware}=require("@clerk/express")
require('dotenv').config()
authorApp.use(clerkMiddleware())
authorApp.post('/author',expressasynchandler(userOrAuthor))

//create new article
authorApp.post('/article',expressasynchandler(async(req,res)=>{
    const newArticleObj=req.body;
    const newArticle=new Article(newArticleObj)
    const articleobj=await newArticle.save()
    res.status(201).send({message:"article published",payload:articleobj})
}))
//read article
authorApp.get('/articles',requireAuth({signInUrl:"unauthorised"}),expressasynchandler(async(req,res)=>{
    const listofArticles=await Article.find()
    res.status(201).send({message:"articles",payload:listofArticles})

}))
authorApp.get('/unauthorised',(req,res)=>{
    res.send({message:"Unauthorised request.."})
})
//modify an article by articleid
authorApp.put('/article/:articleId',requireAuth({signInUrl:"unauthorised"}),expressasynchandler(async(req,res)=>{
     
    //get modified article
    const modifiedarticle=req.body;
    //update article by artcile id
    const dbres=await Article.findByIdAndUpdate(modifiedarticle._id,{...modifiedarticle},{returnOriginal:false})
    //send res
    res.status(200).send({message:"article modified",payload:dbres})

}))
//delete an article by articleid(soft delete)
authorApp.put('/articles/:articleId',expressasynchandler(async (req, res) => {
  
    //get modified article
    let state = req.body;
    //console.log("ma",state)
    //update article by article id
    // if(state.isArticleActive===false){
    //     state.isArticleActive=true;
    // }else{
    //     state.isArticleActive=false;
    // }
    state.isArticleActive = !state.isArticleActive;
    const latestArticle = await Article.findByIdAndUpdate(state._id,
        { ...state },
        { returnOriginal: false })
    //send res
    res.status(200).send({ message: "article deleted or restored", payload: latestArticle })

}))   
  
     
module.exports=authorApp;
     