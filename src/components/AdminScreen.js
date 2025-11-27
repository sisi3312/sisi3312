import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { categories } from "../data/categories";
import "../styles/AdminScreen.css";

const AdminScreen = () => {
  const [sentences, setSentences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    author: "",
    book: "",
    category: "all",
    tags: [],
  });
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // 문장 목록 가져오기
  useEffect(() => {
    fetchSentences();
  }, []);

  const fetchSentences = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("sentences")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching sentences:", error);
        alert("문장 목록을 불러오는 중 오류가 발생했습니다.");
      } else {
        setSentences(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("문장 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 문장 추가
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("sentences")
        .insert([formData])
        .select()
        .single();

      if (error) {
        console.error("Error adding sentence:", error);
        alert("문장 추가 중 오류가 발생했습니다.");
        return;
      }

      setSentences([data, ...sentences]);
      setFormData({
        text: "",
        author: "",
        book: "",
        category: "all",
        tags: [],
      });
      setShowAddForm(false);
      alert("문장이 추가되었습니다.");
    } catch (err) {
      console.error("Error:", err);
      alert("문장 추가 중 오류가 발생했습니다.");
    }
  };

  // 문장 수정
  const handleUpdate = async (id) => {
    try {
      const { error } = await supabase
        .from("sentences")
        .update(formData)
        .eq("id", id);

      if (error) {
        console.error("Error updating sentence:", error);
        alert("문장 수정 중 오류가 발생했습니다.");
        return;
      }

      const updatedSentences = sentences.map((s) =>
        s.id === id ? { ...s, ...formData } : s
      );
      setSentences(updatedSentences);
      setEditingId(null);
      setFormData({
        text: "",
        author: "",
        book: "",
        category: "all",
        tags: [],
      });
      alert("문장이 수정되었습니다.");
    } catch (err) {
      console.error("Error:", err);
      alert("문장 수정 중 오류가 발생했습니다.");
    }
  };

  // 문장 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 이 문장을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const { error } = await supabase.from("sentences").delete().eq("id", id);

      if (error) {
        console.error("Error deleting sentence:", error);
        alert("문장 삭제 중 오류가 발생했습니다.");
        return;
      }

      setSentences(sentences.filter((s) => s.id !== id));
      alert("문장이 삭제되었습니다.");
    } catch (err) {
      console.error("Error:", err);
      alert("문장 삭제 중 오류가 발생했습니다.");
    }
  };

  // 수정 모드 시작
  const startEdit = (sentence) => {
    setEditingId(sentence.id);
    setFormData({
      text: sentence.text || "",
      author: sentence.author || "",
      book: sentence.book || "",
      category: sentence.category || "all",
      tags: sentence.tags || [],
    });
    setShowAddForm(false);
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      text: "",
      author: "",
      book: "",
      category: "all",
      tags: [],
    });
  };

  // 필터링된 문장 목록
  const filteredSentences = sentences.filter((sentence) => {
    const matchesCategory =
      filterCategory === "all" || sentence.category === filterCategory;
    const matchesSearch =
      searchTerm === "" ||
      sentence.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sentence.author &&
        sentence.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sentence.book &&
        sentence.book.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="admin-screen">
        <div className="admin-loading">로딩 중...</div>
      </div>
    );
  }

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `업데이트: ${date.getFullYear()}. ${String(
      date.getMonth() + 1
    ).padStart(2, "0")}. ${String(date.getDate()).padStart(2, "0")}.`;
  };

  return (
    <div className="admin-screen">
      <div className="admin-container">
        <div className="admin-header">
          <div className="header-title">
            <h1>문장 관리</h1>
            <p className="header-subtitle">저장된 문장을 관리하세요</p>
          </div>
          <button
            className="btn-refresh"
            onClick={fetchSentences}
            title="새로고침"
          >
            <span className="refresh-icon">↻</span>
          </button>
        </div>

        {/* 검색 및 필터 */}
        <div className="admin-filters">
          <input
            type="text"
            placeholder="Q 문장 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="category-filter"
          >
            {Object.entries(categories).map(([key, value]) => (
              <option key={key} value={key}>
                {value.emoji} {value.name}
              </option>
            ))}
          </select>
          <button
            className="btn-add"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingId(null);
              setFormData({
                text: "",
                author: "",
                book: "",
                category: "all",
                tags: [],
              });
            }}
          >
            {showAddForm ? "취소" : "+ 새 문장 추가"}
          </button>
        </div>

        {/* 추가 폼 */}
        {showAddForm && (
          <div className="admin-form">
            <h2>새 문장 추가</h2>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>문장 *</label>
                <textarea
                  value={formData.text}
                  onChange={(e) =>
                    setFormData({ ...formData, text: e.target.value })
                  }
                  required
                  rows="4"
                  placeholder="문장을 입력하세요"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>작가</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder="작가명"
                  />
                </div>
                <div className="form-group">
                  <label>책 제목</label>
                  <input
                    type="text"
                    value={formData.book}
                    onChange={(e) =>
                      setFormData({ ...formData, book: e.target.value })
                    }
                    placeholder="책 제목"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>카테고리 *</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  {Object.entries(categories).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.emoji} {value.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  추가
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddForm(false)}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 문장 목록 */}
        <div className="admin-list">
          {filteredSentences.length === 0 ? (
            <div className="empty-state">문장이 없습니다.</div>
          ) : (
            <div className="sentence-list">
              {filteredSentences.map((sentence) => (
                <div
                  key={sentence.id}
                  className={`sentence-card ${
                    editingId === sentence.id ? "editing" : ""
                  }`}
                >
                  {editingId === sentence.id ? (
                    <>
                      <div className="card-icon">📝</div>
                      <div className="card-content">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdate(sentence.id);
                          }}
                          className="card-edit-form"
                        >
                          <div className="card-edit-group">
                            <textarea
                              value={formData.text}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  text: e.target.value,
                                })
                              }
                              required
                              rows="3"
                              className="card-edit-textarea"
                              placeholder="문장을 입력하세요"
                            />
                          </div>
                          <div className="card-edit-row">
                            <input
                              type="text"
                              value={formData.author}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  author: e.target.value,
                                })
                              }
                              placeholder="작가명"
                              className="card-edit-input"
                            />
                            <input
                              type="text"
                              value={formData.book}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  book: e.target.value,
                                })
                              }
                              placeholder="책 제목"
                              className="card-edit-input"
                            />
                            <select
                              value={formData.category}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  category: e.target.value,
                                })
                              }
                              required
                              className="card-edit-select"
                            >
                              {Object.entries(categories).map(
                                ([key, value]) => (
                                  <option key={key} value={key}>
                                    {value.emoji} {value.name}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </form>
                      </div>
                      <div className="card-actions">
                        <button
                          className="btn-learn"
                          onClick={() => handleUpdate(sentence.id)}
                        >
                          저장
                        </button>
                        <button
                          className="btn-delete-card"
                          onClick={cancelEdit}
                        >
                          취소
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="card-icon">📄</div>
                      <div className="card-content">
                        <div className="card-title">
                          {sentence.text.length > 50
                            ? sentence.text.substring(0, 50) + "..."
                            : sentence.text}
                        </div>
                        <div className="card-description">
                          {sentence.text.length > 50
                            ? sentence.text
                            : sentence.author || sentence.book
                            ? `${sentence.author || ""} ${
                                sentence.book || ""
                              }`.trim()
                            : "설명 없음"}
                        </div>
                        <div className="card-details">
                          <span className="card-tag">
                            {categories[sentence.category]?.emoji}{" "}
                            {categories[sentence.category]?.name}
                          </span>
                          <span className="card-date">
                            {formatDate(sentence.created_at)}
                          </span>
                          <span className="card-visibility">
                            {sentence.author || sentence.book ? "📖" : "📝"}{" "}
                            {sentence.author || sentence.book
                              ? "출처 있음"
                              : "출처 없음"}
                          </span>
                        </div>
                      </div>
                      <div className="card-actions">
                        <button
                          className="btn-learn"
                          onClick={() => startEdit(sentence)}
                        >
                          수정
                        </button>
                        <button
                          className="btn-delete-card"
                          onClick={() => handleDelete(sentence.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminScreen;
