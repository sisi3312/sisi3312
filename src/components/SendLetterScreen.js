import React, { useState } from "react";
import "../styles/SendLetterScreen.css";
import islandBackground from "../images/첫화면 섬만 있는 배경.png";
import phoneBackground from "../images/폰 첫화면.png";
import waveImage from "../images/첫화면 파도.png";
import { categories } from "../data/categories";
const SendLetterScreen = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    text: "",
    author: "",
    book: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.text || !formData.category) {
      alert("책 구절과 카테고리는 필수입니다.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="send-letter-screen">
      <div className="background-container">
        <img
          src={islandBackground}
          alt="섬 배경"
          className="island-background desktop-bg"
        />
        <img
          src={phoneBackground}
          alt="폰 배경"
          className="island-background mobile-bg"
        />
        <img src={waveImage} alt="파도" className="send-wave" />
      </div>

      <div className="send-letter-content">
        <button className="back-button" onClick={onBack}>
          ← 뒤로가기
        </button>

        <div className="form-container">
          <h2 className="form-title">병편지 보내기</h2>
          <p className="form-subtitle">
            당신의 소중한 구절을 다른 사람과 나눠보세요
          </p>

          <form onSubmit={handleSubmit} className="letter-form">
            <div className="form-group">
              <label htmlFor="text">책 구절 *</label>
              <textarea
                id="text"
                name="text"
                value={formData.text}
                onChange={handleChange}
                placeholder="마음에 드는 책의 구절을 입력해주세요..."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="author">저자</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="저자명 (선택사항)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="book">책 제목</label>
                <input
                  type="text"
                  id="book"
                  name="book"
                  value={formData.book}
                  onChange={handleChange}
                  placeholder="책 제목 (선택사항)"
                />
              </div>
            </div>

            <div className="form-group">
              <label>카테고리 *</label>
              <div className="category-options">
                {Object.entries(categories).map(([key, category]) => {
                  if (key === "all") return null;
                  return (
                    <label key={key} className="category-option">
                      <input
                        type="radio"
                        name="category"
                        value={key}
                        checked={formData.category === key}
                        onChange={handleChange}
                        required
                      />
                      <span className="category-label">
                        <span className="category-emoji">{category.emoji}</span>
                        {category.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="submit-button">
              ✍️ 병편지 보내기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendLetterScreen;
