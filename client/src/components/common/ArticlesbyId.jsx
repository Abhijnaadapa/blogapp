import {useContext, useState} from 'react'
import { useForm } from 'react-hook-form'
import { useLocation,useNavigate } from 'react-router-dom'
import {userAuthorContextObj} from '../../contexts/UserAuthorContext'
import {FaEdit} from 'react-icons/fa'

import {MdDelete, MdRestore} from 'react-icons/md'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
function ArticlesbyId() {
  const {currentuser}=useContext(userAuthorContextObj)
  const { register, handleSubmit } = useForm()
  const {state}=useLocation()
  const navigate=useNavigate()
  const {getToken}=useAuth()
  const [editArticleStatus,setEditArticlesStatus]=useState(false)
  const [currentArticle,setCurrentArticle]=useState(state)
  const [commentStatus,setcommentStatus]=useState('')
 // console.log(state)
//to enable edit of article
  function enableEdit(){
    setEditArticlesStatus(true)
  }
  //to save modified article
async  function onSave(modifiedarticle){
    const articleAfterChanges={...state,...modifiedarticle}
    const currentDate=new Date();
    const token=await getToken();
    //add date of modification
    articleAfterChanges.dateOfModification+currentDate.getDate()+"-"+currentDate.getMonth()+"-"+currentDate.getFullYear()
    console.log(articleAfterChanges)
    //make http post req
    let res=await axios.put(`http://localhost:3001/author-api/article/${articleAfterChanges.articleId}`,articleAfterChanges,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    if(res.data.message==='article modified'){
      setEditArticlesStatus(false);
      navigate(`/author-profile/articles/${state.articleId}`,{state:res.data.payload})
    }
  }

  // //restore article
  async function restoreArticle(){
    //state.isArticleActive=true;
    console.log("state",state)
    let res =await axios.put(`http://localhost:3001/author-api/articles/${state.articleId}`,state)
    if(res.data.message==='article deleted or restored'){
      setCurrentArticle({ ...res.data.payload })
    }
  }

  //delete article
  async function deleteArticle(){
     //state.isArticleActive=false;
    console.log("state",state)
    let res = await axios.put(`http://localhost:3001/author-api/articles/${state.articleId}`,state)
    if(res.data.message === 'article deleted or restored'){
      setCurrentArticle({ ...res.data.payload })
    }
  }
  //add comments
  async function addcomment(commentObj) {
    commentObj.nameofUser=currentuser.firstName;
    console.log(commentObj)
    //http put req
    let res=await axios.put(`http://localhost:3001/user-api/comment/${currentArticle.articleId}`,commentObj)
    if(res.data.message==='comment added')
    {
      setcommentStatus(res.data.message)
    }
  }
  return (
    <div className='container'>
      {
        editArticleStatus===false?
        <>
      <div className="d-flex justify-content-between">
        <div className="mb-5 author-block w-100 px-4 py-2 rounded-2 d-flex justify-content-between align-items-center">
          <div>
            <p className="display-3 me-4">{state.title}</p>
            <span className="py-3">
              <small className="text-secondary me-4">
                Created on : {state.dateOfCreation}
              </small>
              <small className="text-secondary me-4">
                Created on : {state.dateOfModification}
              </small>
            </span>
          </div>
          <div className="author-details text-center">
            <img src={state.authorData.profileImageurl}  width='60px' className='rounded-circle' alt="" />
            <p>{state.authorData.nameofAuthor}</p>
          </div>
        </div>
          {
            currentuser.role==='author' &&(
              <div className="d-flex me-3">
                <button className="me-2 btn btn-light" onClick={enableEdit}>
                  <FaEdit className='text-warning'/>
                </button>
                {
                  currentArticle.isArticleActive===true?(
                    <button className="me-2 btn btn-light" onClick={deleteArticle}>
                        <MdDelete className="text-danger fs-4" />
                    </button>
                  ):(
                    <button className="me-2 btn btn-light" onClick={restoreArticle}>
                    <MdRestore className="text-info fs-4" />
                </button>
                  )
                }
              </div>
            )
          }
      </div>
      {/* content */}
      <p className="lead mt-3 article-content" style={{whiteSpace:"pre-line"}}>
        {state.content}
      </p>
      {/* user comments */}
      <div>
        <div className="comments my-4">
          {
            state.comments.length===0?<p className='display-3'>No comments yet..</p>:
            state.comments.map(commentObj=>{
              return <div key={commentObj._id} >
                <p className="user-name">
                {commentObj?.nameofUser}</p>
                <p className="comment">
                {commentObj?.comment}</p>
              </div>
            })

          }
        </div>
      </div>
      {/* comment form */}
      <h1>
        {commentStatus}
      </h1>
      {
        currentuser.role==='user' && <form onSubmit={handleSubmit(addcomment)}>
          <input type='text' {...register("comment")} className='form-control mb-4'/>
          <button className='btn btn-success'>
            Add a comment
          </button>
        </form>
      }
      {/* edit form */}
      </> :
   
       <form onSubmit={handleSubmit(onSave)} >
       <div className="mb-4">
         <label htmlFor="title" className="form-label">
           Title
         </label>
         <input
           type="text"
           className="form-control"
           id="title"
           defaultValue={state.title}
           {...register("title")}
         />
       </div>

       <div className="mb-4">
         <label htmlFor="category" className="form-label">
           Select a category
         </label>
         <select
           {...register("category")}
           id="category"
           className="form-select"
           defaultValue={state.category}
         >
           <option value="programming">Programming</option>
           <option value="AI&ML">AI&ML</option>
           <option value="database">Database</option>
         </select>
       </div>
       <div className="mb-4">
         <label htmlFor="content" className="form-label">
           Content
         </label>
         <textarea
           {...register("content")}
           className="form-control"
           id="content"
           rows="10"
           defaultValue={state.content}
         ></textarea>
       </div>

       <div className="text-end">
         <button type="submit" className="btn btn-success">
           Save
         </button>
       </div>
     </form>
      }
     
    </div>
  )
}

export default ArticlesbyId