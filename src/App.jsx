import "./App.css"
import sendIcon from "./assets/send.png"
import {useState, useEffect, useRef} from "react"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import VoiceInput from "./components/VoiceInput";

export default function App()
{
  const [messages, setMessages] = useState([{"role": "user", "content": "hello"}]);
  const [inputValue, setInputValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en-IN");
  const bottomRef = useRef(null);

  const getLanguageName = (code) => {
    const languages = {
      "en-IN": "English",
      "mr-IN": "Marathi", 
      "hi-IN": "Hindi",
      "ml-IN": "Malayalam"
    };
    return languages[code] || "English";
  };

  function handleSend(e)
  {
    e.preventDefault();
    if(inputValue.trim()) {
      setMessages((prev)=>([...prev, {"role": "user", "content": inputValue}]));
      setInputValue("");
    }
  }

  useEffect(()=>{

    bottomRef.current?.scrollIntoView({behaviour: "smooth"})

  }, [messages]);

  const renderedMsgs = messages.map((msg, index)=><div key={index} className={msg.role}><ReactMarkdown>{msg.content}</ReactMarkdown></div>)
      
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
            { role: "system", content: `Please respond in ${getLanguageName(selectedLanguage)} language.` },
            messages[messages.length-1],
            messages[messages.length-2],
            messages[messages.length-3],
            messages[messages.length-4],
            messages[messages.length-5]
          ].filter(Boolean)
        })
      };

      fetch("https://farmerai.atharvawadekar123.workers.dev/", options)
      .then(res=> {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data=>{
        console.log('API Response:', data); // Debug log
        setMessages((prev)=>([...prev, {"role": "assistant", "content": data.received || data}]))
      })
      .catch(error => {
        console.error('API Error:', error);
        setMessages((prev)=>([...prev, {"role": "assistant", "content": "Sorry, I'm having trouble processing your request. Please try again."}]))
      });
      
    }

  }, [messages])

  return (
  <>
    <main>
      <h1 className="heading">🌱 Farmer Chatbot</h1>
      <div className="chat-container">
        
          <div className="messages">
              {renderedMsgs}
              <div ref={bottomRef}></div>
          </div>
          <form className="textbox" onSubmit={handleSend}>
            <div>
              <input 
                type="text" 
                name="query" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about farming..." 
              />
              <button type="submit"><img src={sendIcon} alt="Send" /></button>
            </div>
            <VoiceInput 
              onResult={(text)=> setInputValue(text)} 
              language={selectedLanguage}
              onLanguageChange={(lang) => setSelectedLanguage(lang)}
            />
          </form>

      </div>
    </main>
  </>
  )
}
