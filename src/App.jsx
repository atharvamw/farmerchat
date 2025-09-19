import "./App.css"
import sendIcon from "./assets/send.png"
import {useState, useEffect} from "react"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import VoiceInput from "./components/VoiceInput";

export default function App()
{
  const [messages, setMessages] = useState([{"role": "user", "content": "hello"}]);
  const [inputValue, setInputValue] = useState("");
  const [voiceMsg, setVoiceMsg] = useState("");

  function handleSend(formdata)
  {
    if(inputValue.trim()) {
      setMessages((prev)=>([...prev, {"role": "user", "content": formdata.get("query")}]));
      setInputValue("");
    }
  }

  const renderedMsgs = messages.map((msg, index)=><p key={index} className={msg.role}><ReactMarkdown>{msg.content}</ReactMarkdown></p>)
      
  useEffect(()=>{
    
    if(messages[messages.length-1].role == "user")
    {

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "messages": [
            
            messages[messages.length-1],
            messages[messages.length-2],
            messages[messages.length-3],
            messages[messages.length-4],
            messages[messages.length-5]
          ].filter(Boolean)
        })
      };

      fetch("https://farmerai.atharvawadekar123.workers.dev/", options)
      .then(res=> res.json())
      .then(data=>{
        setMessages((prev)=>([...prev, {"role": "assistant", "content": data}]))
    }
  );
      
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
          <form className="textbox" action={handleSend}>
            <input 
              type="text" 
              name="query" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about farming..." 
            />
            <button type="submit"><img src={sendIcon} alt="Send" /></button>
            <VoiceInput onResult={(text)=> setInputValue(text) }/>
          </form>

      </div>
    </main>
  </>
  )
}
