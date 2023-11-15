"use client"
import { useContext, useEffect, useState } from "react"
import Nav from "../components/nav"
import "../styles/host.scss"
import { useRouter } from "next/navigation"
import MicroServiceClient from "../services/api"
import { wrapImg } from "../services/utils"
import profiles from "./data"
import { AuthContext } from "../context/AuthContext"
 
export default function HostPage(){
    const [title,setTitle] = useState('')
    const  [btnclass,setBtnClass] = useState("btn")
    const {setUsername,username,setUimg} = useContext(AuthContext)
      const [selected,setSelected] = useState(null)
      const [teams,setteams] = useState(0)
      const [maxper,setmaxper] = useState(0)
    const router = useRouter()
    const {userid} = useContext(AuthContext)
    function handleSubmit(){ 
        const v = title==''?"btn vibrating":"btn"
        setBtnClass(v)
      setTimeout(()=>{
          setBtnClass("btn")
      },2000)
      if(title!=""){
        MicroServiceClient.createSession({
            title:title,
            userid:userid,
            uimg:selected,
            username:username,
            teams:teams,
            maxper:maxper

        }).then((res)=>{
            router.push(`/game/${res._id}`)
         
        
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
                <input placeholder="Teddy's Classroom" value={title} onChange={(e)=>{
                    setTitle(e.target.value)
                }} />
            
            </div>

            <label htmlFor="">
                Username
            </label>
            <div className="input-box">
                <input placeholder="teddyoweh" value={username} onChange={(e)=>{
             
                    setUsername(e.target.value)
                }} />
            
            </div><div className="row">

  
                <div className="">
                <label htmlFor="">
                Number of Teams
            </label>
            <div className="input-box number">
                <input type="number" placeholder="Team Number" value={teams} onChange={(e)=>{
   
                    setteams(e.target.value)
                }} />
            
            </div>
            
                </div>
                <div className="">
                <label htmlFor="">
                Max Persons  
            </label>
            <div className="input-box number">
                <input type="number" placeholder="   Max Persons per Team" value={maxper} onChange={(e)=>{
   
   setmaxper(e.target.value)
                }} />
            
            </div>
            </div>
                </div>
            <label htmlFor="">
                Profile</label>
                <div className="profiles-imgs">
            {profiles&&profiles.map((image,index)=>{

                return (
                    <div key={index} className={selected==image? "profile-img active":"profile-img"} 
                    onClick={(e)=>{
              
                        setUimg(image)
                 
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