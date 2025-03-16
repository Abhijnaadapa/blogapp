import React, { createContext, useContext,useEffect, useState } from 'react'
import {userAuthorContextObj} from '../../contexts/UserAuthorContext.jsx'
import {useUser} from '@clerk/clerk-react'
import { useNavigate } from "react-router-dom";
import blogImage from '../../assets/image.png';
import axios from 'axios'
function Home() {
    const {currentuser,setcurrentuser}=useContext(userAuthorContextObj)
    const navigate = useNavigate();
    const {isSignedIn,user,isLoaded}=useUser()
    const [error,setError]=useState("");
    const [accountDisabled, setAccountDisabled] = useState(false);
   console.log("isSignedin :",isSignedIn)
    console.log("User :",user)
   console.log("isloaded :",isLoaded)
    useEffect(()=>{
      if(isSignedIn===true){
      setcurrentuser(
          {
              ...currentuser,
              firstName:user?.firstName,
              lastName:user?.lastName,
              email:user?.emailAddresses[0].emailAddress,
              profileImageurl:user?.imageUrl   
          }
      );
    }
  },[isLoaded])
  console.log("current user ",currentuser)
  
  useEffect(()=>{
   
    if(currentuser?.role==='user' && error.length===0){
      navigate(`/user-profile/${currentuser.email}`)
    }
    if(currentuser?.role==='author' && error.length===0){
      console.log("first")
      navigate(`/author-profile/${currentuser.email}`)
    }
  },[currentuser?.role]);
  useEffect(() => {
    localStorage.removeItem("currentuser");
}, []);

    async function onSelectRole(e) {
        setError('')      
        const selectedRole = e.target.value;
        console.log(selectedRole);
        currentuser.role = selectedRole;
        let res = null;
      try{
        if (selectedRole === 'author') {
          res = await axios.post('http://localhost:3001/author-api/author', currentuser);
          console.log(res);
          let { message, payload } = res.data;
          if (message === 'author') {
            setcurrentuser({ ...currentuser, ...payload });
            localStorage.setItem("currentuser",JSON.stringify(payload))
          }else{
            setError(message);
          }
        } 
         if (selectedRole === 'user') {
          res = await axios.post('http://localhost:3001/user-api/user', currentuser);
          console.log(res);
          let { message, payload } = res.data;
          if (message === 'user') {
            setcurrentuser({ ...currentuser, ...payload });
            localStorage.setItem("currentuser",JSON.stringify(payload))
          }else{
            setError(message);
          }
        }
      }catch(err){
        console.error('Login failed:', err);
        if (err.response?.status === 401) {
            setAccountDisabled(true);
        } else {
            setError('Something went wrong. Please try again.');
        }
      }
       
      
    }
    function renderAccountDisabledMessage() {
      return accountDisabled ? (
          <p className='text-danger fs-5' style={{ fontFamily: 'sans-serif' }}>
              Your account has been disabled. Please contact support.
          </p>
      ) : null;
  }

    
  return (
    <div className='container home-container'>
      {!isSignedIn && (
                <div className="text-center welcome-section">
                     <h1>Welcome to <span className="highlight">Blog App</span></h1>
                    <img src={blogImage} alt="Blog App" className="blog-image"/>
                    <p className="lead">
                        Discover amazing stories and share your thoughts with the world.
                    </p>
                </div>
            )}

      {
        isSignedIn===true && 
        <div>
        <div className='d-flex justify-content-evenly  bg-info p-3'>
            <img src={user.imageUrl} width="100px" className='rounded-circle' alt="" />
            <p className="display-3">{user.firstName}</p>
        </div>
        <p className="lead text-start mt-2">Select role</p>
        {error && <p className='text-danger fs-5' style={{ fontFamily: 'sans-serif' }}>{error}</p>}
                    {renderAccountDisabledMessage()}
        <div className='d-flex role-radio py-3 justify-content-center'> 
         
          <div className='form-check me-4'>
            <input type="radio" name="role" id="author" value="author" className='form-check-input' onChange={onSelectRole}/>
            <label htmlFor="author" className='form-check-label'>Author</label>
           </div>
           <div className='form-check'>
            <input type="radio" name="role" id="user"  value="user" className='form-check-input'onChange={onSelectRole}/>
            <label htmlFor="user" className='form-check-label'>User</label>
           </div>

        </div>
        </div>


      }
    </div>
  )
}

export default Home