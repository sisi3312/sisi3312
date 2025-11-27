import React, { useState, useEffect } from 'react';
import '../styles/LetterScreen.css';
import letterBackground from '../images/편지.png';
import { categories } from '../data/categories';

const LetterScreen = ({ sentence, isVisible, onClose }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMeta, setShowMeta] = useState(false);

  useEffect(() => {
    if (isVisible && sentence) {
      setDisplayedText('');
      setIsTyping(true);
      setShowMeta(false);
      
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index <= sentence.text.length) {
          setDisplayedText(sentence.text.slice(0, index));
          index++;
        } else {
          setIsTyping(false);
          setShowMeta(true);
          clearInterval(typingInterval);
        }
      }, 50);

      return () => clearInterval(typingInterval);
    } else {
      setDisplayedText('');
      setIsTyping(false);
      setShowMeta(false);
    }
  }, [sentence, isVisible]);

  if (!isVisible || !sentence) return null;

  const category = categories[sentence.category] || categories.all;

  return (
    <div className={`letter-screen-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="letter-background">
        <img src={letterBackground} alt="편지 배경" className="letter-bg-image" />
        
        <button className="letter-close-button" onClick={onClose}>
          ✕
        </button>
        
        <div className="letter-content">
          <div 
            className="category-tag"
            style={{ backgroundColor: category.color }}
          >
            <span className="category-emoji">{category.emoji}</span>
            <span className="category-name">{category.name}</span>
          </div>
          
          <p className="letter-text">
            "{displayedText}"
            {isTyping && <span className="typing-cursor">|</span>}
          </p>
          
          {showMeta && (
            <div className="letter-meta">
              {sentence.author ? (
                <p className="letter-author">- {sentence.author}</p>
              ) : !sentence.book ? (
                <p className="letter-author">- 익명</p>
              ) : null}
              {sentence.book && (
                <p className="letter-book">『{sentence.book}』</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LetterScreen;