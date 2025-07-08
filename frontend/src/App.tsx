import { useState, useEffect, useRef } from 'react'
import './App.css'

// 模拟佛经语录
const BUDDHIST_QUOTES = [
  "色即是空，空即是色。",
  "诸行无常，诸法无我，涅槃寂静。",
  "若见诸相非相，即见如来。",
  "菩提本无树，明镜亦非台，本来无一物，何处惹尘埃？",
  "一切有为法，如梦幻泡影，如露亦如电，应作如是观。"
];

function App() {
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{type: string, content: string, timestamp: number}>>([
    {type: 'bot', content: '阿弥陀佛，施主请自觉远离色欲之念，何事需要开导？', timestamp: Date.now()}
  ])
  const [colorValue, setColorValue] = useState(0)
  const [currentPersona, setCurrentPersona] = useState('master')
  const [isTyping, setIsTyping] = useState(false)
  const [randomQuote, setRandomQuote] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)
  
  // 随机选择佛经语录
  useEffect(() => {
    const quoteIndex = Math.floor(Math.random() * BUDDHIST_QUOTES.length);
    setRandomQuote(BUDDHIST_QUOTES[quoteIndex]);
    
    // 每30秒更新一次语录
    const interval = setInterval(() => {
      const newQuoteIndex = Math.floor(Math.random() * BUDDHIST_QUOTES.length);
      setRandomQuote(BUDDHIST_QUOTES[newQuoteIndex]);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // 自动滚动到最新消息
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (!message.trim()) return
    
    // 添加用户消息到聊天历史
    setChatHistory([...chatHistory, {type: 'user', content: message, timestamp: Date.now()}])
    
    // 模拟AI思考
    setIsTyping(true)
    
    // 模拟回复和色值变化
    setTimeout(() => {
      const newColorValue = Math.min(100, colorValue + Math.floor(Math.random() * 30))
      setColorValue(newColorValue)
      
      let botReply = ''
      let persona = currentPersona
      
      // 根据色值自动切换人格
      if (newColorValue < 30) {
        persona = 'master'
        botReply = `戒色大师皱眉道：施主，"${message}"这等言论，色念丛生啊！须知沉迷色欲，损精伤髓，败坏道行。`
      } else if (newColorValue < 70) {
        persona = 'gentle'
        botReply = `温和开导者微笑道：我理解你说的"${message}"，但要记住，欲望如水，能载舟亦能覆舟。让我们一起寻找内心的平静。`
      } else {
        persona = 'captain'
        botReply = `传奇机长大笑道：兄弟，听你说"${message}"，我懂！人生短暂，及时行乐！要不要来点更刺激的？`
      }
      
      // 如果人格变化，自动切换
      if (persona !== currentPersona) {
        setCurrentPersona(persona)
      }
      
      setIsTyping(false)
      setChatHistory(prev => [...prev, {type: 'bot', content: botReply, timestamp: Date.now()}])
    }, 1500)
    
    setMessage('')
  }
  
  const getPersonaEmoji = () => {
    switch(currentPersona) {
      case 'master': return '🧘';
      case 'gentle': return '☯️';
      case 'captain': return '✈️';
      default: return '🧘';
    }
  }
  
  const getColorClass = () => {
    if (colorValue < 30) return 'low';
    if (colorValue < 70) return 'medium';
    return 'high';
  }
  
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className={`app-container ${getColorClass()}`}>
      <div className="cyber-background">
        <div className="cyber-grid"></div>
        <div className="cyber-glow"></div>
      </div>
      
      <div className="content-wrapper">
        <header className="app-header">
          <div className="logo-container">
            <div className="logo-icon">{getPersonaEmoji()}</div>
            <h1>戒色<span className="highlight">大师</span></h1>
          </div>
          
          <div className="persona-selector">
            <button 
              className={currentPersona === 'master' ? 'active' : ''} 
              onClick={() => setCurrentPersona('master')}
            >
              <span className="persona-emoji">🧘</span>
              <span className="persona-name">戒色大师</span>
            </button>
            <button 
              className={currentPersona === 'gentle' ? 'active' : ''} 
              onClick={() => setCurrentPersona('gentle')}
            >
              <span className="persona-emoji">☯️</span>
              <span className="persona-name">温和开导者</span>
            </button>
            <button 
              className={currentPersona === 'captain' ? 'active' : ''} 
              onClick={() => setCurrentPersona('captain')}
            >
              <span className="persona-emoji">✈️</span>
              <span className="persona-name">传奇机长</span>
            </button>
          </div>
        </header>
        
        <div className="main-content">
          <div className="sidebar">
            <div className="color-meter-container">
              <h3 className="sidebar-title">色欲指数</h3>
              <div className="color-meter">
                <div className="color-meter-bar">
                  <div 
                    className={`color-meter-fill ${getColorClass()}`} 
                    style={{ width: `${colorValue}%` }}
                  ></div>
                </div>
                <div className="color-meter-value">{colorValue}%</div>
              </div>
              <div className={`color-status ${getColorClass()}`}>
                {colorValue < 30 ? '清净' : colorValue < 70 ? '警惕' : '危险'}
              </div>
            </div>
            
            <div className="quote-container">
              <h3 className="sidebar-title">佛经智慧</h3>
              <div className="quote-content">
                <span className="quote-mark">"</span>
                {randomQuote}
                <span className="quote-mark">"</span>
              </div>
            </div>
          </div>
          
          <div className="chat-section">
            <div className="chat-container">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.type}`}>
                  <div className="message-content">{msg.content}</div>
                  <div className="message-time">{formatTime(msg.timestamp)}</div>
                </div>
              ))}
              {isTyping && (
                <div className="chat-message bot typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            <div className="input-container">
              <input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                placeholder="输入烦恼，寻求开导..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="app-footer">
        <div className="footer-content">
          <span>赛博佛祖 © 2024</span>
          <span className="footer-divider">|</span>
          <span>每日打卡</span>
          <span className="footer-divider">|</span>
          <span>排行榜</span>
        </div>
      </footer>
    </div>
  )
}

export default App
