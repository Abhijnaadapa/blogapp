const mongoose=require("mongoose")
const authorSchema=new  mongoose.Schema({
    nameofAuthor:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    profileImageurl:{
        type:String,
     
    }
},{"strict":true})
//
const userCommentSchema=new mongoose.Schema({
        nameofUser:{
            type:String,
            required:true
        },
        comment:{
            type:String,
            required:true
        }
},{"strict":true})
const articleSchema=new mongoose.Schema({
    authorData:authorSchema,
    articleId:{
        type:String,
        required:true,//spelling mistake
        unique:true
    },
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    content:{
    type:String,
    required:true
    },
    dateOfCreation:{
        type:String,
        required:true
    },
    dateOfModification:{
        type:String,
        required:true
    },
    comments:[userCommentSchema],

    isArticleActive:{
        type:Boolean,
        required:true
    }
},{"strict":true})

//create model for article
const Article=mongoose.model('article',articleSchema)

//exports
module.exports=Article  