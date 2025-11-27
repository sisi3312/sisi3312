import React, { useState, useEffect } from 'react';
import '../styles/MessageCard.css';
import { categories } from '../data/categories';

const MessageCard = ({ sentence, isVisible, onClose }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isVisible && sentence) {
      setDisplayedText('');
      setIsTyping(true);
      
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index <= sentence.text.length) {
          setDisplayedText(sentence.text.slice(0, index));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 50);

      return () => clearInterval(typingInterval);
    }
  }, [sentence, isVisible]);

  if (!isVisible || !sentence) return null;

  const category = categories[sentence.category] || categories.all;

  return (
    <div className={`message-card-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="message-card">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        
        <div 
          className="category-badge"
          style={{ backgroundColor: category.color }}
        >
          <span className="category-emoji">{category.emoji}</span>
          <span className="category-name">{category.name}</span>
        </div>
        
        <div className="message-content">
          <p className="message-text">
            "{displayedText}"
            {isTyping && <span className="typing-cursor">|</span>}
          </p>
          
          {!isTyping && (
            <div className="message-meta">
              {sentence.author && (
                <p className="message-author">- {sentence.author}</p>
              )}
              {sentence.book && (
                <p className="message-book">『{sentence.book}』</p>
              )}
            </div>
          )}
        </div>
        
        <div className="message-decorations">
          <div className="decoration decoration-1"></div>
          <div className="decoration decoration-2"></div>
          <div className="decoration decoration-3"></div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;