import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [socket, setSocket] = useState<null | WebSocket>(null)
  const [messages, setMessages] = useState<string[]>([])
  const [curMessage, setCurMessage] = useState<string>('')

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')
    ws.onopen = () => {
      console.log("socket is connected")
      setSocket(ws)
    }
    ws.onmessage = (message: any) => {
      console.log('message recieved from server', message.data);
      setMessages((prev) => [...prev, message.data])
    }

    return () => {
      ws.close()
    }
  }, [])
  if (!socket) {
    return <>
      connecting to Websocket server
    </>
  }

  return (
    <div className='flex flex-col items-center justify-center mx-auto m-20  w-1/2 '>
      <div className='flex gap-6 w-full justify-center'>
        <input type="text" className='p-2 bg-gray-800 rounded-xl ring-1 w-64 ring-gray-500 focus-within:ring-2 text-white' placeholder='Enter the message here' onChange={(e) => setCurMessage(e.target.value)} value={curMessage} />
        <button className='text-black bg-white px-5 py-1 rounded-xl ' onClick={() => {
          if (curMessage !== "") socket.send(curMessage)
          setCurMessage('')
        }}>Send</button>
      </div>
      <div className='flex flex-col gap-2 mt-10'>
        {
          messages.map((message, index) => <div className=' rounded-full px-5 py-2 w-fit bg-white text-black' key={index}>{message}</div>)
        }
      </div>
    </div>
  )
}

export default App
