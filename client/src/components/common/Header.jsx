import React from 'react'
import { useContext } from 'react'
import logo from "../../assets/logo4.avif";
import { Link, useNavigate } from 'react-router-dom'
import { useClerk,useUser} from '@clerk/clerk-react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext.jsx'
function Header() {
  const {signOut}=useClerk()
   const {isSignedIn,user,isLoaded}=useUser()
  const {currentuser,setcurrentUser}=useContext(userAuthorContextObj)
  const navigate=useNavigate()
  //function to signout
  async function handleSignout() {
    await signOut();
    setcurrentUser(null)
    navigate('/')
    
  }

  return (
    <div >
      <nav className='header d-flex justify-content-between align-items-center'>
        <div className='d-flex justify-content-center'>
        <Link href="/">
            <img src={logo} alt="" width="60px" className="ms-4" />
          </Link>
            </div>
            <ul className='d-flex justify-content-around  list-unstyled header-links' >
          {
              !isSignedIn?
                <>
                <li>

                <Link to=''>Home</Link>

            </li>
            <li>
                <Link to='signin'>Signin</Link>

            </li>
            <li>
                <Link to='signup'>Signup</Link>
            </li>
            <li>
           <Link to='/admin/login'>Admin</Link>
             </li>
            </>:
            <div className='user-button'>
              <div style={{position:'relative'}}>
                <img src={user.imageUrl} width='40px' className='rounded-circle' alt="" />
                <p className='role' style={{position:'absolute',top:"0px",right:"-20px",backgroundColor: 'yellow',
          color: 'black',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '12px'}}>{currentuser.role}</p>
              </div>
              <p className='mb-0 user-name'>{user.firstName}</p>
  
              <button className='btn btn-danger signout-btn' onClick={handleSignout}>SignOut</button>
            </div>
              

          }
        </ul>  
        
      </nav>
    </div>
  )
}

export default Header