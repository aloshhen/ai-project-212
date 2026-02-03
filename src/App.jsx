import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// SafeIcon component - converts kebab-case to PascalCase
function SafeIcon({ name, size = 24, className, color }) {
  const icons = {
    'scissors': 'Scissors',
    'menu': 'Menu',
    'x': 'X',
    'map-pin': 'MapPin',
    'phone': 'Phone',
    'instagram': 'Instagram',
    'clock': 'Clock',
    'star': 'Star',
    'check-circle': 'CheckCircle',
    'send': 'Send',
    'user': 'User',
    'calendar': 'Calendar',
    'chevron-right': 'ChevronRight',
    'chevron-left': 'ChevronLeft',
    'message-square': 'MessageSquare',
    'bot': 'Bot',
    'sparkles': 'Sparkles',
    'flame': 'Flame',
    'zap': 'Zap',
    'award': 'Award',
    'trending-up': 'TrendingUp',
    'coffee': 'Coffee',
    'home': 'Home',
    'info': 'Info',
    'image': 'Image',
    'mail': 'Mail',
    'scissors-line-dashed': 'ScissorsLineDashed',
  };
  
  const pascalName = icons[name] || 'HelpCircle';
  
  // Inline SVG icons for reliability
  const svgIcons = {
    'Scissors': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></svg>,
    'Menu': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
    'X': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
    'MapPin': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
    'Phone': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    'Instagram': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
    'Clock': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    'Star': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    'CheckCircle': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    'Send': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/></svg>,
    'User': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    'Calendar': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>,
    'ChevronRight': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><path d="m9 18 6-6-6-6"/></svg>,
    'ChevronLeft': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><path d="m15 18-6-6 6-6"/></svg>,
    'MessageSquare': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    'Bot': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>,
    'Sparkles': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
    'Flame': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><path d="M12 2c0 0-7 4-7 11v3l-2 2h18l-2-2v-3c0-7-7-11-7-11Z"/><path d="M12 14a2 2 0 0 1-2-2c0-1.1 1-3 2-3s2 1.9 2 3a2 2 0 0 1-2 2Z"/></svg>,
    'Zap': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    'Award': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
    'TrendingUp': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    'Coffee': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6.01" y1="2" y2="2"/><line x1="10" x2="10.01" y1="2" y2="2"/><line x1="14" x2="14.01" y1="2" y2="2"/></svg>,
    'Home': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    'Info': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
    'Image': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>,
    'Mail': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    'HelpCircle': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>,
    'ScissorsLineDashed': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? {color} : {}}><path d="M5.3 5.3a1 1 0 0 1 1.4 0l5.9 5.9"/><path d="M12 9.4 9.4 12"/><path d="m5.3 18.7 6.6-6.6"/><path d="M18.7 18.7a1 1 0 0 1-1.4 0l-5.9-5.9"/><path d="M12 14.6l2.6 2.6"/><circle cx="12" cy="12" r="2"/><path d="M4 22h16"/><path d="M2 12h20"/></svg>,
  };
  
  return svgIcons[pascalName] || svgIcons['HelpCircle'];
}

// Web3Forms Hook
const useFormHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e, accessKey) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(false);
    
    const formData = new FormData(e.target);
    formData.append('access_key', accessKey);
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
        e.target.reset();
      } else {
        setIsError(true);
        setErrorMessage(data.message || 'Что-то пошло не так');
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage('Ошибка сети. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setIsSuccess(false);
    setIsError(false);
    setErrorMessage('');
  };
  
  return { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm };
};

// Map Component
const CleanMap = ({ coordinates = [14.4378, 50.0755], zoom = 14 }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: coordinates,
      zoom: zoom,
      attributionControl: false,
      interactive: true,
      dragPan: true,
      dragRotate: false,
      touchZoomRotate: false,
      doubleClickZoom: true,
      keyboard: false
    });

    map.current.scrollZoom.disable();

    const el = document.createElement('div');
    el.style.cssText = `
      width: 32px;
      height: 32px;
      background: #dc2626;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      cursor: pointer;
    `;
    
    new maplibregl.Marker({ element: el })
      .setLngLat(coordinates)
      .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML('<strong style="color:#dc2626;">BAZA Barbershop</strong><br/>Praha'))
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [coordinates, zoom]);

  return (
    <div className="w-full h-full min-h-[350px] rounded-2xl overflow-hidden shadow-2xl border border-red-900/30 relative">
      <style>{`
        .maplibregl-ctrl-attrib { display: none !important; }
        .maplibregl-ctrl-logo { display: none !important; }
        .maplibregl-compact { display: none !important; }
      `}</style>
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

// FAQ Data for Chat Widget
const FAQ_DATA = [
  {
    question: "Как записаться на стрижку?",
    answer: "Вы можете записаться через форму на сайте, по телефону +420 XXX XXX XXX или написать нам в Instagram @baza_prague",
    keywords: ["запись", "записаться", "стрижка", "как", "booking", "online"]
  },
  {
    question: "Сколько стоит стрижка?",
    answer: "Мужская стрижка — 600 Kč, борода — 400 Kч, комплекс (стрижка + борода) — 900 Kč. Уточняйте актуальные цены у барберов.",
    keywords: ["цена", "стоимость", "сколько", "price", "cost", "kč"]
  },
  {
    question: "Где вы находитесь?",
    answer: "Мы находимся в центре Праги, рядом с метро. Точный адрес: ulice XXX, Praha 1. На карте выше можете посмотреть расположение.",
    keywords: ["где", "адрес", "локация", "address", "location", "прага", "praha"]
  },
  {
    question: "Какие часы работы?",
    answer: "Мы работаем ежедневно с 10:00 до 20:00. В выходные дни возможны изменения, рекомендуем уточнять заранее.",
    keywords: ["часы", "работа", "время", "когда", "hours", "open", "time"]
  },
  {
    question: "Нужно ли записываться заранее?",
    answer: "Да, мы работаем по предварительной записи. Это гарантирует, что вас обслужят в удобное время без ожидания.",
    keywords: ["предварительно", "заранее", "appointment", "advance", "нужно"]
  }
];

const SITE_CONTEXT = "BAZA Barbershop — креативный барбершоп в Праге для молодежи и студентов. Стрижки, бритьё, уход за бородой. Яркий стиль, атмосфера уличной культуры.";

// Chat Widget Component
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Привет! Я помощник BAZA Barbershop. Чем могу помочь?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const findFAQAnswer = (text) => {
    const lowerText = text.toLowerCase();
    for (const faq of FAQ_DATA) {
      if (faq.keywords.some(keyword => lowerText.includes(keyword))) {
        return faq.answer;
      }
    }
    return null;
  };
  
  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = inputText.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInputText('');
    setIsTyping(true);
    
    // Try FAQ first
    const faqAnswer = findFAQAnswer(userMessage);
    
    if (faqAnswer) {
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', text: faqAnswer }]);
        setIsTyping(false);
      }, 800);
    } else {
      // Fallback to API
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage, context: SITE_CONTEXT })
        });
        
        if (response.ok) {
          const data = await response.json();
          setMessages(prev => [...prev, { type: 'bot', text: data.reply }]);
        } else {
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: 'Извини, я не совсем понял. Попробуй спросить о записи, ценах или адресе. Или позвони нам: +420 XXX XXX XXX' 
          }]);
        }
      } catch (error) {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: 'Сейчас не могу подключиться к серверу. Напиши нам в Instagram @baza_prague или позвони!' 
        }]);
      } finally {
        setIsTyping(false);
      }
    }
  };
  
  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-2xl flex items-center justify-center border-2 border-white/20"
        style={{ boxShadow: '0 8px 32px rgba(220, 38, 38, 0.4)' }}
      >
        {isOpen ? (
          <SafeIcon name="x" size={24} className="text-white" />
        ) : (
          <SafeIcon name="message-square" size={24} className="text-white" />
        )}
      </motion.button>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-[360px] bg-gray-900 rounded-2xl shadow-2xl border border-red-900/30 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <SafeIcon name="bot" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">BAZA Assistant</h3>
                <p className="text-xs text-red-100">Обычно отвечает моментально</p>
              </div>
            </div>
            
            {/* Messages */}
            <div className="h-[320px] overflow-y-auto p-4 space-y-3 bg-gray-950">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.type === 'user' 
                      ? 'bg-red-600 text-white rounded-br-md' 
                      : 'bg-gray-800 text-gray-100 rounded-bl-md border border-gray-700'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 text-gray-400 p-3 rounded-2xl rounded-bl-md border border-gray-700">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="p-3 bg-gray-900 border-t border-gray-800 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Напиши вопрос..."
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600 border border-gray-700"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-xl flex items-center justify-center transition-colors"
              >
                <SafeIcon name="send" size={16} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [razorAnimated, setRazorAnimated] = useState(false);
  
  // Booking form hook
  const { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm } = useFormHandler();
  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'; // Replace with your Web3Forms Access Key from https://web3forms.com
  
  // Scroll animation refs
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const galleryRef = useRef(null);
  const reviewsRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true });
  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" });
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  
  useEffect(() => {
    const timer = setTimeout(() => setRazorAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);
  
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };
  
  // Services data
  const services = [
    {
      title: "Мужская стрижка",
      price: "600 Kč",
      duration: "45 мин",
      icon: "scissors",
      description: "Классическая или современная стрижка с мытьём головы и укладкой"
    },
    {
      title: "Борода",
      price: "400 Kč",
      duration: "30 мин",
      icon: "sparkles",
      description: "Моделирование бороды, оформление контуров, уход"
    },
    {
      title: "Комплекс",
      price: "900 Kč",
      duration: "75 мин",
      icon: "zap",
      description: "Стрижка + борода. Полное преображение со скидкой"
    },
    {
      title: "Королевское бритьё",
      price: "500 Kč",
      duration: "40 мин",
      icon: "flame",
      description: "Горячими полотенцами, опасной бритвой и премиум косметикой"
    }
  ];
  
  // Reviews data
  const reviews = [
    {
      name: "Михаил",
      rating: 5,
      text: "Лучший барбершоп в Праге! Атмосфера огонь, барберы знают своё дело. Хожу только сюда.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Артём",
      rating: 5,
      text: "Крутой стиль, приятная музыка, делают быстро и качественно. Цены адекватные для студента.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Давид",
      rating: 5,
      text: "Наконец-то нашёл свой барбершоп! Граффити на стенах, хип-хоп в колонках, идеально.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    }
  ];
  
  // Gallery images (Instagram style)
  const galleryImages = [
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899f?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605497788044-5a32c707848f?w=400&h=400&fit=crop"
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-inter mobile-safe-container">
      
      {/* HEADER */}
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-md z-40 border-b border-red-900/30">
        <nav className="container mx-auto max-w-7xl px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon name="scissors" size={32} className="text-red-600" />
            <span className="text-3xl font-bebas tracking-wider text-white graffiti-text">BAZA</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-red-500 transition-colors font-medium">О нас</button>
            <button onClick={() => scrollToSection('services')} className="text-gray-300 hover:text-red-500 transition-colors font-medium">Услуги</button>
            <button onClick={() => scrollToSection('gallery')} className="text-gray-300 hover:text-red-500 transition-colors font-medium">Галерея</button>
            <button onClick={() => scrollToSection('reviews')} className="text-gray-300 hover:text-red-500 transition-colors font-medium">Отзывы</button>
            <button onClick={() => scrollToSection('booking')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition-all transform hover:scale-105">
              Записаться
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center"
          >
            {isMenuOpen ? (
              <SafeIcon name="x" size={24} className="text-white" />
            ) : (
              <SafeIcon name="menu" size={24} className="text-white" />
            )}
          </button>
        </nav>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-900 border-t border-red-900/30"
            >
              <div className="flex flex-col p-4 space-y-4">
                <button onClick={() => scrollToSection('about')} className="text-left text-gray-300 hover:text-red-500 py-2">О нас</button>
                <button onClick={() => scrollToSection('services')} className="text-left text-gray-300 hover:text-red-500 py-2">Услуги</button>
                <button onClick={() => scrollToSection('gallery')} className="text-left text-gray-300 hover:text-red-500 py-2">Галерея</button>
                <button onClick={() => scrollToSection('reviews')} className="text-left text-gray-300 hover:text-red-500 py-2">Отзывы</button>
                <button onClick={() => scrollToSection('booking')} className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold">Записаться</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 bg-graffiti overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
        
        {/* Animated Razor Lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={razorAnimated ? { x: '100%' } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-lg shadow-red-600/50"
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={razorAnimated ? { x: '100%' } : {}}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"
          />
        </div>
        
        <div className="relative z-10 container mx-auto max-w-7xl px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-bebas tracking-tight mb-4">
              <span className="text-white inline-block transform -skew-x-6">BAZA</span>
            </h1>
            
            <motion.div
              initial={{ width: 0 }}
              animate={heroInView ? { width: '100%' } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent max-w-md mx-auto mb-6"
            />
            
            <p className="text-2xl md:text-4xl font-bebas text-red-500 mb-4 tracking-wide">
              BARBERSHOP PRAHA
            </p>
            
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Уличная культура. Качественные стрижки. Атмосфера свободы. 
              Для тех, кто ценит стиль.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('booking')}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all shadow-lg shadow-red-600/50 flex items-center justify-center gap-2 min-h-[56px]"
              >
                <SafeIcon name="calendar" size={20} />
                Онлайн запись
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('services')}
                className="w-full sm:w-auto bg-transparent border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-10 py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-2 min-h-[56px]"
              >
                <SafeIcon name="scissors" size={20} />
                Услуги и цены
              </motion.button>
            </div>
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-red-600 rounded-full flex justify-center pt-2">
              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-red-600 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" ref={aboutRef} className="py-20 md:py-32 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block bg-red-600/20 text-red-500 px-4 py-2 rounded-full text-sm font-bold mb-6">
                <SafeIcon name="info" size={16} className="inline mr-2" />
                О НАС
              </div>
              <h2 className="text-5xl md:text-6xl font-bebas mb-6 leading-tight">
                ГДЕ <span className="text-red-600">УЛИЧНАЯ</span> КУЛЬТУРА<br />
                ВСТРЕЧАЕТ <span className="text-yellow-500">СТИЛЬ</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                BAZA — это не просто барбершоп. Это база для тех, кто живёт в ритме города, 
                ценит аутентичность и не боится выделяться. Мы создали пространство, где 
                молодёжь Праги может получить качественную стрижку в атмосфере уличного искусства, 
                хип-хопа и свободы самовыражения.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Наши барберы — не просто мастера, они часть культуры. Каждая стрижка — это 
                произведение искусства, созданное с учётом твоего характера и стиля жизни.
              </p>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bebas text-red-600">500+</div>
                  <div className="text-sm text-gray-500">Стрижек</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bebas text-yellow-500">4</div>
                  <div className="text-sm text-gray-500">Барбера</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bebas text-red-600">5★</div>
                  <div className="text-sm text-gray-500">Рейтинг</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border-2 border-red-900/30">
                <img 
                  src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80" 
                  alt="BAZA Barbershop Interior" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-red-900/30">
                    <p className="text-white font-bold">Интерьер BAZA</p>
                    <p className="text-gray-400 text-sm">Граффити, неон, уличное искусство</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-red-600 text-white rounded-full w-24 h-24 flex items-center justify-center font-bebas text-xl transform rotate-12 shadow-xl"
              >
                SINCE<br/>2020
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" ref={servicesRef} className="py-20 md:py-32 bg-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #dc2626 0, #dc2626 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={servicesInView ? { opacity: 1, y: 0 } : {}}
              className="text-5xl md:text-7xl font-bebas mb-4"
            >
              УСЛУГИ <span className="text-red-600">&</span> ЦЕНЫ
            </motion.h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Качественные стрижки по адекватным ценам. Студенческие скидки по предъявлению ISIC.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-red-900/30 hover:border-red-600 transition-all duration-300 overflow-hidden"
              >
                {/* Hover GIF Effect Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-[url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWx2b3J3bW4zbm1kZnV4Ymx0dHR1d3d4eHh5Znl6Z3o3Z3JvdXA.gif')] bg-cover bg-center"></div>
                
                <div className="relative z-10">
                  <div className="bg-red-600/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-600/40 transition-colors">
                    <SafeIcon name={service.icon} size={28} className="text-red-500" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 h-10">{service.description}</p>
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bebas text-yellow-500">{service.price}</p>
                      <p className="text-gray-500 text-xs">{service.duration}</p>
                    </div>
                    <button 
                      onClick={() => scrollToSection('booking')}
                      className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
                    >
                      <SafeIcon name="chevron-right" size={20} className="text-white" />
                    </button>
                  </div>
                </div>
                
                {/* Corner Accent */}
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-red-600/10 rounded-full group-hover:bg-red-600/20 transition-colors"></div>
              </motion.div>
            ))}
          </div>
          
          {/* Student Discount Banner */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={servicesInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-red-900/40 via-red-600/20 to-yellow-500/20 rounded-2xl p-6 md:p-8 border border-red-600/30 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                <SafeIcon name="award" size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bebas text-white">СТУДЕНЧЕСКАЯ СКИДКА 15%</h3>
                <p className="text-gray-400">Покажи ISIC / студенческий билет и получи скидку на любую услугу</p>
              </div>
            </div>
            <button 
              onClick={() => scrollToSection('booking')}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all whitespace-nowrap"
            >
              Записаться со скидкой
            </button>
          </motion.div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" className="py-20 md:py-32 bg-gradient-to-b from-black to-gray-950">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <div>
              <h2 className="text-5xl md:text-7xl font-bebas mb-2">
                ГАЛЕРЕЯ <span className="text-red-600">#BAZA_PRAGUE</span>
              </h2>
              <p className="text-gray-400">Наши работы в Instagram</p>
            </div>
            <a 
              href="https://instagram.com/baza_prague" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-red-500 hover:text-red-400 font-bold transition-colors"
            >
              <SafeIcon name="instagram" size={20} />
              @baza_prague
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
              >
                <img 
                  src={img} 
                  alt={`BAZA Work ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="flex items-center gap-2 text-white">
                    <SafeIcon name="heart" size={16} className="text-red-500" />
                    <span className="text-sm font-medium">{124 + index * 23} likes</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <a 
              href="https://instagram.com/baza_prague"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              <SafeIcon name="instagram" size={20} />
              Смотреть больше в Instagram
            </a>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-20 md:py-32 bg-black">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-bebas mb-4">
              ЧТО <span className="text-yellow-500">ГОВОРЯТ</span> КЛИЕНТЫ
            </h2>
            <div className="flex items-center justify-center gap-1">
              {[1,2,3,4,5].map(star => (
                <SafeIcon key={star} name="star" size={24} className="text-yellow-500 fill-yellow-500" />
              ))}
              <span className="ml-2 text-gray-400">4.9 из 5 на Google</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-red-900/20 hover:border-red-600/40 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={review.avatar} 
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-red-600"
                  />
                  <div>
                    <h4 className="font-bold text-white">{review.name}</h4>
                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <SafeIcon key={i} name="star" size={14} className="text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">"{review.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking" className="py-20 md:py-32 bg-gradient-to-b from-gray-950 to-black relative">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl font-bebas mb-4">
              ЗАПИСЬ <span className="text-red-600">ONLINE</span>
            </h2>
            <p className="text-gray-400">Выбери удобное время и забронируй стрижку за 2 минуты</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 md:p-10 border border-red-900/30 shadow-2xl">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={(e) => handleSubmit(e, ACCESS_KEY)}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Имя</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Твоё имя"
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-red-900/30 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Телефон</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+420 XXX XXX XXX"
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-red-900/30 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Услуга</label>
                      <select 
                        name="service"
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-red-900/30 rounded-xl text-white focus:outline-none focus:border-red-600 transition-colors appearance-none"
                      >
                        <option value="">Выбери услугу</option>
                        <option value="haircut">Мужская стрижка (600 Kč)</option>
                        <option value="beard">Борода (400 Kč)</option>
                        <option value="complex">Комплекс (900 Kč)</option>
                        <option value="shave">Королевское бритьё (500 Kč)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Предпочтительная дата</label>
                      <input
                        type="date"
                        name="date"
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-red-900/30 rounded-xl text-white focus:outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Комментарий (опционально)</label>
                    <textarea
                      name="message"
                      placeholder="Особые пожелания, предпочтительное время..."
                      rows="3"
                      className="w-full px-4 py-3 bg-black/50 border border-red-900/30 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-colors resize-none"
                    ></textarea>
                  </div>
                  
                  <input type="hidden" name="subject" value="Новая запись в BAZA Barbershop" />
                  <input type="hidden" name="from_name" value="BAZA Website" />
                  
                  {isError && (
                    <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded-xl text-sm">
                      {errorMessage}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-3 min-h-[56px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Отправка...
                      </>
                    ) : (
                      <>
                        <SafeIcon name="send" size={20} />
                        Записаться
                      </>
                    )}
                  </button>
                  
                  <p className="text-center text-gray-500 text-xs">
                    Мы перезвоним вам для подтверждения записи в течение 2 часов
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className="text-center py-12"
                >
                  <div className="bg-green-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                    <SafeIcon name="check-circle" size={48} className="text-green-500" />
                  </div>
                  <h3 className="text-4xl font-bebas text-white mb-4">
                    ЗАЯВКА ОТПРАВЛЕНА!
                  </h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
                    Спасибо! Мы получили твою запись и скоро перезвоним для подтверждения.
                  </p>
                  <button
                    onClick={resetForm}
                    className="text-red-500 hover:text-red-400 font-bold transition-colors inline-flex items-center gap-2"
                  >
                    <SafeIcon name="calendar" size={18} />
                    Записать ещё одного человека
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* MAP & CONTACTS SECTION */}
      <section className="py-20 bg-black">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="h-[400px] lg:h-auto min-h-[350px]"
            >
              <CleanMap coordinates={[14.4378, 50.0755]} zoom={14} />
            </motion.div>
            
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-red-900/30"
            >
              <h3 className="text-3xl font-bebas mb-6">КОНТАКТЫ</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="map-pin" size={24} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Адрес</h4>
                    <p className="text-gray-400">Praha 1, ulice Na Příkopě XX<br />(в центре, рядом с метро Můstek)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="clock" size={24} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Часы работы</h4>
                    <p className="text-gray-400">Пн-Пт: 10:00 — 20:00<br />Сб-Вс: 11:00 — 18:00</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="phone" size={24} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Телефон</h4>
                    <a href="tel:+420123456789" className="text-red-500 hover:text-red-400 font-bold text-lg">
                      +420 123 456 789
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="instagram" size={24} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Instagram</h4>
                    <a href="https://instagram.com/baza_prague" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 font-bold">
                      @baza_prague
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-red-900/30">
                <p className="text-gray-500 text-sm mb-4">Подпишись на нас:</p>
                <div className="flex gap-4">
                  <a href="https://instagram.com/baza_prague" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                    <SafeIcon name="instagram" size={24} className="text-white" />
                  </a>
                  <a href="https://tiktok.com/@baza_prague" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-black border border-gray-700 rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-xs">TikTok</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-red-900/30 py-12 telegram-safe-bottom">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <SafeIcon name="scissors" size={24} className="text-red-600" />
              <span className="text-2xl font-bebas tracking-wider text-white">BAZA BARBERSHOP</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
              <button onClick={() => scrollToSection('about')} className="hover:text-red-500 transition-colors">О нас</button>
              <button onClick={() => scrollToSection('services')} className="hover:text-red-500 transition-colors">Услуги</button>
              <button onClick={() => scrollToSection('gallery')} className="hover:text-red-500 transition-colors">Галерея</button>
              <button onClick={() => scrollToSection('booking')} className="hover:text-red-500 transition-colors">Запись</button>
            </div>
            
            <div className="text-gray-600 text-sm">
              © 2024 BAZA Barbershop. Praha.
            </div>
          </div>
        </div>
      </footer>

      {/* CHAT WIDGET */}
      <ChatWidget />
    </div>
  );
}

export default App;