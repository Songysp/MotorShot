import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LiveCCTVPage.css';
import sampleImage from '../assets/images/sample_video.png';
import recordDBIcon from '../assets/images/db.png';
import cctvIcon_big from '../assets/images/cctv_big.png';
import video_small from '../assets/images/video_small.png';
import bikeIcon from '../assets/images/motorcycle.png';
import DetectionFooter from '../components/DetectionFooter';
import DetectedVehicleList from '../components/DetectedVehicleList';

function LiveCCTVPage() {
  const [cctvVideoURL, setCctvVideoURL] = useState('');
  const [detectedVehicles, setDetectedVehicles] = useState([]);
  const navigate = useNavigate();
  const mainVideoRef = useRef(null);
  const originalVideoRef = useRef(null); // originalVideoRef를 정의합니다.
  const detectionVideoRefs = useRef([]);

  useEffect(() => {
    // CCTV 데이터를 백엔드에서 가져옵니다.
    const fetchCCTVData = async () => {
      try {
        const token = localStorage.getItem('token');  // 저장된 토큰 가져오기
        const response = await fetch('http://localhost:8080/record', {
          headers: {
            // 'Authorization': `Bearer ${token}`
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzNmZTgwZTM4OTVjYjVjMTM2OTMyZSJ9._xtHfwaVOOJLilzauhdnuOMhB-xwJ3jPY4C9LjFk90k`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // 데이터를 가져온 후 상태로 설정
          setDetectedVehicles(data);
          if (data.length > 0) {
            setCctvVideoURL(data[0].video);  // 첫 번째 기록의 비디오 URL 사용
          }
        } else {
          console.error('데이터를 가져오는 중 오류 발생:', response.statusText);
        }
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchCCTVData(); // 컴포넌트 마운트 시 데이터 가져오기
  }, []);

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
  }, [cctvVideoURL]);

  const handleVideoUploadClick = () => {
    navigate('/analysis'); // 영상업로드 전환 버튼 클릭 시 '/analysis' 경로로 이동합니다.
  };

  return (
    <div className="cctv-analysis-page">
      <div className="cctv-sidebar">
        <img src={cctvIcon_big} alt="로고" className="cctv-logo" />
        <h2 className="cctv-text_1">실시간 CCTV</h2>
        <ul className="cctv-record-list">
          <li className="cctv-menu-item" onClick={() => navigate('/record-db')}>
            <img src={recordDBIcon} alt="단속기록 DB" className="cctv-recordDBIcon" />
            <span className="cctv-record_text">단속기록 DB</span>
          </li>
          <li className="cctv-menu-item" onClick={handleVideoUploadClick}>
            <img src={video_small} alt="영상업로드 전환" className="cctv-video_small" />
            <span className="cctv-cctv_text">영상업로드 전환</span>
          </li>
        </ul>
        <img src={bikeIcon} alt="오토바이 아이콘" className="cctv-bike-icon" />
      </div>

      <div className="cctv-main-content">
        <div className="cctv-video-analysis">
          <div className="cctv-video-header">
            <span>영상분석</span>
            <span>경부 고속도로</span>
          </div>
          <div className="cctv-video-container-video-page">
            {cctvVideoURL ? (
              <video ref={mainVideoRef} className="cctv-video-frame" controls>
                <source src={cctvVideoURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={sampleImage} alt="Sample Video" className="cctv-video-frame" />
            )}
          </div>
          <DetectionFooter helmetCount={'04'} dangerCount={'01'} speedCount={2} />
        </div>

        <div className="cctv-right-sidebar">
          <div className="cctv-video-thumbnail">
            <h3>원본영상</h3>
            {cctvVideoURL ? (
              <video ref={originalVideoRef} className="cctv-thumbnail" controls>
                <source src={cctvVideoURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={sampleImage} alt="Original Video" className="cctv-thumbnail" />
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

export default LiveCCTVPage;
