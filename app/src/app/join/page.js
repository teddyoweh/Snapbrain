"use client"
import { useContext, useEffect, useState } from "react"
import Nav from "../components/nav"
import "../styles/host.scss"
import { useRouter } from "next/navigation"
import MicroServiceClient from "../services/api"
import { wrapImg } from "../services/utils"
import profiles from "./data"
import { AuthContext } from "../context/AuthContext"
 
export default function JoinPage(){
    const [code,setCode] = useState('')
    const  [btnclass,setBtnClass] = useState("btn")
    const {setUsername,username,setUimg,userid} = useContext(AuthContext)
      const [selected,setSelected] = useState(null)
 
    const router = useRouter()
    function handleSubmit(){ 
        const v = code==''||username!=""||selected!=null?"btn vibrating":"btn"
        setBtnClass(v)
      setTimeout(()=>{
          setBtnClass("btn")
      },2000)
      if(code!=""&&username!=""&&selected!=null){
        MicroServiceClient.joinSession({
            code:code,
            userid:userid,
            uimg:selected,
            username:username,
     

        }).then((res)=>{
            router.push(`/game/${res.session._id}`)
         
        
        })
      }
    }
    return (
        <div className="host">
        <Nav image={selected}/>

        <div className="form">
        <div className="host-app">
     

 
            <label htmlFor="">
                Session Code
            </label>
            <div className="input-box">
                <input placeholder="hdfDIs" value={code} onChange={(e)=>{
                    setCode(e.target.value)
                }} />
            
            </div>

            <label htmlFor="">
                Username
            </label>
            <div className="input-box">
                <input placeholder="teddyoweh" value={username} onChange={(e)=>{
             
                    setUsername(e.target.value)
                }} />
            
            </div>

          
            <label htmlFor="">
                Profile</label>
                <div className="profiles-imgs">
            {profiles&&profiles.map((image,index)=>{
                const uriz = require(`../assets/images/${image}`).default.src

                return (
                    <div key={index} className={selected==image? "profile-img active":"profile-img"} 
                    onClick={(e)=>{
              
                        setUimg(image)
                 
                        setSelected(image)
                    
                    }

                    
                        }>
      <img src={uriz} alt=""/>                    </div>
                )
            })}
        </div>
            <div className={btnclass} onClick={handleSubmit}>
                    Join
                </div>
                </div>
        </div>
        </div>
    )
}