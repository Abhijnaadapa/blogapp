import {createContext ,useEffect,useState} from "react"
export const userAuthorContextObj=createContext();

function UserAuthorContext({children}) {
    let [currentuser,setcurrentuser]=useState({
        firstName:'',
        lastName:"",
        email:"",
        profileImageurl:'',
        role:''
    })
    useEffect(()=>{
      const userInStorage=localStorage.getItem('currentuser');
      if(userInStorage){
        setcurrentuser(JSON.parse(userInStorage))
      }
    },[])
  return (
    <userAuthorContextObj.Provider value={{currentuser,setcurrentuser}}>
        {children}
    </userAuthorContextObj.Provider>
  )
}

export default UserAuthorContext