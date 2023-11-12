"use client"
import { useEffect, useState } from "react"
import Nav from "../components/nav"
import "../styles/host.scss"
import { useRouter } from "next/navigation"
import MicroServiceClient from "../services/api"
import { wrapImg } from "../services/utils"
import profiles from "./data"
 
export default function HostPage(){
    const [title,setTitle] = useState('')
    const  [btnclass,setBtnClass] = useState("btn")
    const [username,setUsername] = useState("")
     const [selected,setSelected] = useState(null)
    const router = useRouter()
    function handleSubmit(){ 
        const v = title==''?"btn vibrating":"btn"
        setBtnClass(v)
      setTimeout(()=>{
          setBtnClass("btn")
      },2000)
      if(title!=""){
        MicroServiceClient.createSession({
            title:title,
            userid:localStorage.getItem("userid")

        }).then((res)=>{
            router.push(`/game/${res.sessionId}`)
         
        
        })
      }
    }
    return (
        <div className="host">
        <Nav image={selected}/>

        <div className="form">
        <div className="host-app">
     

 
            <label htmlFor="">
                Session Title
            </label>
            <div className="input-box">
                <input placeholder="Hydie's Classroom" value={title} onChange={(e)=>{
                    setTitle(e.target.value)
                }} />
            
            </div>

            <label htmlFor="">
                Username
            </label>
            <div className="input-box">
                <input placeholder="Hydie's Classroom" value={username} onChange={(e)=>{
                    localStorage.setItem("username",e.target.value)
                    setUsername(e.target.value)
                }} />
            
            </div>
            <label htmlFor="">
                Profile</label>
                <div className="profiles-imgs">
            {profiles&&profiles.map((image,index)=>{

                return (
                    <div key={index} className={selected==image? "profile-img active":"profile-img"} 
                    onClick={(e)=>{
              
                        localStorage.setItem("profileimg",image)
                 
                        setSelected(image)
                    
                    }

                    
                        }>
                        <img src={wrapImg(image)} alt=""/>
                    </div>
                )
            })}
        </div>
            <div className={btnclass} onClick={handleSubmit}>
                    Start
                </div>
                </div>
        </div>
        </div>
    )
}