import "./App.css"
import sendIcon from "./assets/send.png"
import {useState, useEffect} from "react"

export default function App()
{
  const [messages, setMessages] = useState([{"direction": "sent", "message": "hello"}]);
  const [inputValue, setInputValue] = useState("");

  function handleSend(e)
  {
    e.preventDefault();
    if(inputValue.trim()) {
      setMessages((prev)=>([...prev, {"direction": "sent", "message": inputValue}]));
      setInputValue("");
    }
  }

  const renderedMsgs = messages.map((msg, index)=><p key={index} className={msg.direction}>{msg.message}</p>)

  useEffect(()=>{
    
    if(messages[messages.length-1].direction == "sent")
    {
      fetch("https://farmerai.atharvawadekar123.workers.dev/?query=" + messages[messages.length-1].message)
      .then(res => res.json())
      .then(data=>setMessages((prev)=>([...prev, {"direction": "received", "message": data}])));
    }

  }, [messages])

  return (
  <>
    <main>
      <h1 className="heading">🌱 Farmer Chatbot</h1>
      <div className="chat-container">
        
          <div className="messages">
              {renderedMsgs}
          </div>
          <form className="textbox" onSubmit={handleSend}>
            <input 
              type="text" 
              name="query" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about farming..." 
            />
            <button type="submit"><img src={sendIcon} alt="Send" /></button>
          </form>

      </div>
    </main>
  </>
  )
}
