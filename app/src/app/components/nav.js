"use client"
import '../styles/nav.scss'
import logo from '../assets/logo.png'
import Link from 'next/link'
import { wrapImg } from '../services/utils'
import { useEffect, useState } from 'react'

export default function Nav({image}){
 
    const [profile,setProfile] = useState(null)
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
            localStorage.profileimg && image?
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                <div className="profile-img">
                    <img src={wrapImg(image)}/>

                </div>:
                  <div className="profile-img">
                  <img src={wrapImg(localStorage.profileimg)}/>

              </div>
                          }  
           
                {

localStorage.username&&
                
                <div className="profile-name">
                    <label>
                        {localStorage.username}
                    </label>
                </div>
                }
            </div>
        </nav>
     

    )
}