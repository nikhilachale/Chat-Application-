
import { useEffect, useState } from 'react'
import './App.css'

function App() {
    const [msg,setmsg]=useState(["hiii nikhil here "])

  useEffect(()=>{
    const ws= new WebSocket("https://localhost:8080")
    ws.onmessage=(event)=>{
      setmsg(m=>...m,event.data)
    }
  },[])

  return (
    <>
      
    </>
  )
}

export default App
