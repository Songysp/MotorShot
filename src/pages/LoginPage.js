import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';  // CSS 파일을 import합니다.
import motorcycleIcon from '../assets/images/motorcycle.png';  // 이미지 import

function LoginPage() {
  const [formData, setFormData] = useState({
    userid: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/user/login', formData);
      localStorage.setItem('token', response.data.access_token);
      navigate('/');
    } catch (error) {
      setError('로그인 실패: 아이디와 비밀번호를 확인하세요.');
      console.error('로그인 실패', error);
    }
  };

  const handleSignup = () => {
    navigate('/signup'); // 회원가입 페이지로 이동
  };

  return (
    <div className="login-page">
      <div className="login-icon-container">
        <img src={motorcycleIcon} alt="Motorcycle Icon" className="login-icon" />
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>로그인</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          name="userid"
          placeholder="아이디"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          onChange={handleChange}
          required
        />
        <div className="button-container">
          <button type="submit" className="login-button">로그인</button>
          <button type="button" className="signup-button" onClick={handleSignup}>
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
