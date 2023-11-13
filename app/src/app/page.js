"use client"
import Image from 'next/image'
import './styles/landing.scss'
import logo from './assets/logo.png'
import Link from 'next/link'
import { useEffect } from 'react'
import { uniqueId_,checkId } from './services/utils'
export default function Home() {
  useEffect(()=>{
    checkId()
   
  },[])
  return (
 <>
<div className="landing">
  <div className="n"></div>
  <div className="logo-box">
{/* <img src={logo.src}/> */}

<div className="logo">
  <div className="top">
    {/* <label htmlFor="">
    ┏
    </label>
    <label htmlFor="">
    ┓
    </label> */}
  </div>
  <div className="center">
  <img src={logo.src}/>
    <label htmlFor="">SnapBrain.</label>
  </div>
  <div className="top">
    {/* <label htmlFor="">
    ┗
    </label>
    <label htmlFor="">
    ┛
    </label> */}
  </div>
</div>

<div className="btns">

<Link href={"/host"}>
Host
</Link>
<Link href={"/join"}>
Join
</Link>
</div>
</div>
<div className="b"></div>
</div>
 </>
  )
}
