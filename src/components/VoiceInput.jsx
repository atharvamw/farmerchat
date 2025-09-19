import { useState, useEffect } from "react";
import micIcon from "../assets/microphone.png"

export default function VoiceInput({ onResult }) {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition!");
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-IN";          // Language
    rec.interimResults = true;   // Get partial results
    rec.continuous = true;      

    rec.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      onResult(transcript); // Send transcript to parent
      //console.log(transcript);
    };

    rec.onend = () => setListening(false);

    setRecognition(rec);
  }, []);

  const startListening = (e) => {
    e.preventDefault();
    if (recognition) {
      setListening(true);
      recognition.start();
    }
  };

  const stopListening = (e) => {
    e.preventDefault();
    if (recognition) recognition.stop();
    setListening(false);
  };

  return (
    <div>
      <button onClick={listening ? stopListening : startListening}>
        
        {listening ? "Stop" : <img src={micIcon} alt="Speak"/>} 
      </button>
    </div>
  );
}