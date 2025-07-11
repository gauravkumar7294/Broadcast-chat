import './App.css'
import {useEffect,useState,useRef} from 'react'

function App() {
  const [messages,setMessages]=useState(["Hi there", "hi"]);
  const wsRef=useRef();
  const inputRef=useRef();

  useEffect(()=>{
    const ws=new WebSocket("http://localhost:8080");
    ws.onmessage=(event)=>{
      setMessages(m=>[...m,event.data])
    }
    wsRef.current=ws;
    ws.onopen=()=>{
      ws.send(JSON.stringify({
        type:"join",
        payload:{
          roomId:"red"
        }
      }))
    }
    return ()=>{
      ws.close()
    }
  },[]);

  return (
    <div className='h-screen bg-black'>
      <br/><br/><br/>
      <div className='h-[95vh]'>
        {messages.map(message=><div className='m-8'>
          <span className='bg-white text-black rounded p-4'>
            {message}</span>
          </div>)}
      </div>
      <div className='w-full bg-white flex'>
        <input ref={inputRef} id="message" className="flex-1 p-4"></input>
        <button onClick={()=>{
          const message=inputRef.current?.value;
          wsRef.current.send(JSON.stringify({
            type:"chat",
            payload:{
              message:message
            }
          }))
        }}className='bg-purple-600 text-white p-4'>
          Send Message
        </button>
      </div>
    </div>
  )
}

export default App
