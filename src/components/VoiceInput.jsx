import { useState, useEffect } from "react";
import micIcon from "../assets/microphone.png"
import waveSound from "../assets/wave-sound.png"

export default function VoiceInput({ onResult, language, onLanguageChange }) {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const languages = [
    { code: "en-IN", name: "English" },
    { code: "mr-IN", name: "Marathi" },
    { code: "hi-IN", name: "Hindi" },
    { code: "ml-IN", name: "Malayalam" }
  ];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition!");
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = language;
    rec.interimResults = false;
    rec.continuous = true; // Changed to false to prevent continuous listening issues

    rec.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      onResult(transcript);
    };

    rec.onend = () => setListening(false);
    
    rec.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access.');
      } else if (event.error === 'language-not-supported') {
        alert(`Language ${language} is not supported. Switching to English.`);
        onLanguageChange('en-IN');
      }
    };

    setRecognition(rec);
  }, [language, onResult, onLanguageChange]);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

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
    <div className="voice-input-container">
      <button 
        onClick={listening ? stopListening : startListening}
        className={listening ? "voice-button listening" : "voice-button"}
      > 
        {listening ? <img src={waveSound} alt="Stop"/> : <img src={micIcon} alt="Speak"/>} 
      </button>
      <select 
        value={language} 
        onChange={handleLanguageChange}
        className="language-select"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}