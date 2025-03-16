import React, { useContext } from 'react'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext.jsx'
function PostArticle() {
 const {register,handleSubmit,formState:{errors}}=useForm()
 const navigate=useNavigate()
 const {currentuser}=useContext(userAuthorContextObj)
 //console.log(currentuser)
 async function postArticle(articleobj) {
  console.log("currentuser",currentuser)
  const authorData={
    nameofAuthor:currentuser.firstName,
    email:currentuser.email,
    profileImageurl:currentuser.profileImageurl
  }
  articleobj.authorData=authorData;
  //articleId
  articleobj.articleId=Date.now();
 
  //add date of creation and modification
  let currentDate=new Date();
  articleobj.dateOfCreation=currentDate.getDate()+"-"
                            +currentDate.getMonth()+"-"
                            +currentDate.getFullYear()+" "
                            +currentDate.toLocaleTimeString("en-US",{hour12:true})
  articleobj.dateOfModification=currentDate.getDate()+"-"
                                +currentDate.getMonth()+"-"
                                +currentDate.getFullYear()+" "
                                +currentDate.toLocaleTimeString("en-US",{hour12:true})
  //add comments array
  articleobj.comments=[];
  articleobj.isArticleActive=true;
  console.log(articleobj)
 const res=await axios.post('http://localhost:3001/author-api/article',articleobj)
 console.log("res:",res);
 if(res.status===201)
 {
  navigate(`/author-profile/${currentuser.email}/articles`)

 }else{


 }
  
 }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-log-8 col-md-8 col-sm-10">
          <div className="card shadow">
            <div className="card-title text-center border-bottom">
              <h2 className="p-3" style={{color:"goldenrod"}}>
                Write an Article
              </h2>
            </div>
            <div className="card-body bg-light">
              <form onSubmit={handleSubmit(postArticle)}>
                <div className="mb-4">
                  <label htmlFor="title" className='form-label'>Title</label>
                  <input type="text" className="form-control" id="title"  {...register("title", { required: "Title is required" })} />
                </div>
                <div className="mb-4">
                  <label htmlFor='category' className="form-label">
                    Select Category
                  </label>
                  <select className="form-select" id="category" defaultValue=""
                   {...register("category", {
                    required: "Category is required",
                  })}>
                    <option value="" disabled>--categories--</option>
                    <option value="programming">Programming</option>
                    <option value="AI&ML">AI & ML</option>
                    <option value="database">Database</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="content" className='form-label'>Content</label>
                  <textarea className="form-control" id="content" rows="10"
                   {...register("content", { required: "Content is required" })}></textarea>
                </div>
                <div className="text-end">
                  <button type='submit' className='add-article-btn'>
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )

}
export default PostArticle