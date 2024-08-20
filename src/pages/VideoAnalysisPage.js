import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VideoAnalysisPage.css';
import sampleImage from '../assets/images/sample_video.png';
import video from '../assets/images/video_big.png';
import recordDBIcon from '../assets/images/db.png';
import cctvIcon from '../assets/images/cctv_small.png';
import bikeIcon from '../assets/images/motorcycle.png';
import DetectionFooter from '../components/DetectionFooter';
import DetectedVehicleList from '../components/DetectedVehicleList';

function VideoAnalysisPage() {
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [detectedVehicles, setDetectedVehicles] = useState([]);
  const navigate = useNavigate();
  const mainVideoRef = useRef(null);
  const originalVideoRef = useRef(null);
  const detectionVideoRefs = useRef([]);

  useEffect(() => {
    // 백엔드에서 기록 데이터를 가져오는 API 호출
    const fetchDetectedVehicles = async () => {
      try {
        const token = localStorage.getItem('token');  // 저장된 토큰 가져오기
        const response = await fetch('http://localhost:8080/record', {
          headers: {
            // 'Authorization': `Bearer ${token}`  // Authorization 헤더에 토큰 추가
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzNmZTgwZTM4OTVjYjVjMTM2OTMyZSJ9._xtHfwaVOOJLilzauhdnuOMhB-xwJ3jPY4C9LjFk90k`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // 데이터를 가져온 후 상태로 설정
          setDetectedVehicles(data);
        } else {
          console.error('데이터를 가져오는 중 오류 발생:', response.statusText);
        }
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchDetectedVehicles(); // 컴포넌트 마운트 시 데이터 가져오기
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newVideoURL = URL.createObjectURL(file);
      setUploadedVideo(file.name);
      setVideoURL(newVideoURL);
    }
  };

  const syncVideos = (action) => {
    if (action === 'play') {
      if (originalVideoRef.current) originalVideoRef.current.play();
      detectionVideoRefs.current.forEach((video) => {
        if (video) video.play();
      });
    } else if (action === 'pause') {
      if (originalVideoRef.current) originalVideoRef.current.pause();
      detectionVideoRefs.current.forEach((video) => {
        if (video) video.pause();
      });
    }
  };

  useEffect(() => {
    const mainVideoElement = mainVideoRef.current;

    const handlePlay = () => syncVideos('play');
    const handlePause = () => syncVideos('pause');

    if (mainVideoElement) {
      mainVideoElement.addEventListener('play', handlePlay);
      mainVideoElement.addEventListener('pause', handlePause);
    }

    return () => {
      if (mainVideoElement) {
        mainVideoElement.removeEventListener('play', handlePlay);
        mainVideoElement.removeEventListener('pause', handlePause);
      }
    };
  }, [videoURL]);

  const handleCCTVClick = () => {
    navigate('/live-cctv');
  };

  return (
    <div className="analysis-page">
      <div className="sidebar">
        <img src={video} alt="로고" className="logo" />
        <h2 className="text_1">업로드영상 분석</h2>
        <ul className="record-list">
          <li className="menu-item" onClick={() => navigate('/record-db')}>
            <img src={recordDBIcon} alt="단속기록 DB" className="recordDBIcon" />
            <span className="record_text">단속기록 DB</span>
          </li>
          <li className="menu-item" onClick={handleCCTVClick}>
            <img src={cctvIcon} alt="실시간 CCTV 전환" className="cctvIcon" />
            <span className="cctv_text">실시간 CCTV 전환</span>
          </li>
        </ul>
        <img src={bikeIcon} alt="오토바이 아이콘" className="bike-icon" />
      </div>

      <div className="main-content">
        <div className="video-analysis">
          <div className="video-header">
            <span>영상분석</span>
            <span>{uploadedVideo ? uploadedVideo : 'sample_video.mp4'}</span>
            <input
              type="file"
              accept="video/*"
              style={{ display: 'none' }}
              id="file-upload"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="upload-button">
              동영상 업로드 ⬆
            </label>
          </div>
          <div className="video-container-video-page">
            {videoURL ? (
              <video ref={mainVideoRef} className="video-frame" controls>
                <source src={videoURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={sampleImage} alt="Sample Video" className="video-frame" />
            )}
            <div className="video-controls">
              <button onClick={() => mainVideoRef.current && mainVideoRef.current.play()}>◀</button>
              <button onClick={() => mainVideoRef.current && mainVideoRef.current.pause()}>⏸</button>
              <button onClick={() => mainVideoRef.current && mainVideoRef.current.play()}>▶</button>
              <span>04:32 / 08:00</span>
            </div>
          </div>
          <DetectionFooter helmetCount={'04'} dangerCount={'01'} speedCount={2} />
        </div>

        <div className="right-sidebar">
          <div className="video-thumbnail">
            <h3>원본영상</h3>
            {videoURL ? (
              <video ref={originalVideoRef} className="thumbnail" controls>
                <source src={videoURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={sampleImage} alt="Original Video" className="thumbnail" />
            )}
          </div>
          <DetectedVehicleList 
            detectedVehicles={detectedVehicles} 
            detectionVideoRefs={detectionVideoRefs} 
            sampleImage={sampleImage} 
          />
        </div>
      </div>
    </div>
  );
}

export default VideoAnalysisPage;
