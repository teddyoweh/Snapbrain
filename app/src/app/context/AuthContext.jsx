"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
 
import { Js } from 'iconsax-react';
import { WebSocketClient } from '../config/socket';

function Loading() {
  return (
    <div className="loading">
      <img src={logo.src} alt="Loading..." />
    </div>
  );
}

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userid, setUserId] = useState(typeof localStorage !== 'undefined' ? localStorage.getItem('userid') : null);
  const [uimg, setUimg] = useState(typeof localStorage !== 'undefined' ? localStorage.getItem('uimg') : null);
  const [username, setUsername] = useState(typeof localStorage !== 'undefined' ? localStorage.getItem('username') : null);
  
  const router = useRouter();

 
 
  

  return (
    <AuthContext.Provider value={{ username, userid,uimg,setUimg,setUsername  }}>
      {children}
    </AuthContext.Provider>
  );
}