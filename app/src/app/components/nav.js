"use client"
import '../styles/nav.scss'
import logo from '../assets/logo.png'
import Link from 'next/link'
import { wrapImg } from '../services/utils'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Nav({image}){
 
    const [profile,setProfile] = useState(null)
    const {username,uimg} = useContext(AuthContext)
    useEffect(()=>{
 
     
    })
    return (
        <nav>
       <Link
        href={"/"}
        >

            <img src={logo.src}/>
            <label>
                SnapBrain
            </label>
            </Link>
            <div className="profile">    

            {
            uimg&&
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                <div className="profile-img">
                    <img src={wrapImg(uimg)}/>
                   

                </div> 
                          }  
           
                {

 username&&
                
                <div className="profile-name">
                    <label>
                        {username}
                    </label>
                </div>
                }
            </div>
        </nav>
     

    )
}