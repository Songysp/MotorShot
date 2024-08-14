import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate를 import합니다.
import '../styles/VideoAnalysisPage.css';
import sampleImage from '../assets/images/sample_video.png';
import helmetIcon from '../assets/images/helmet.png';
import dangerIcon from '../assets/images/danger.png';
import speedIcon from '../assets/images/speed.png';
import logoImage from '../assets/images/logo.png';
import recordDBIcon from '../assets/images/Group 46.png';
import cctvIcon from '../assets/images/Group 65.png';
import bikeIcon from '../assets/images/image.png';
import DetectionFooter from '../components/DetectionFooter';
import DetectedVehicleList from '../components/DetectedVehicleList';

function VideoAnalysisPage() {
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 얻습니다.
  const mainVideoRef = useRef(null);
  const originalVideoRef = useRef(null);
  const detectionVideoRefs = useRef([]);

  const detectedVehicles = [
    {
      id: 1,
      type: '헬멧미착용',
      icon: helmetIcon,
      licensePlate: '가1234',
      time: '2024-08-10 22:04:45',
      video: videoURL,
    },
    {
      id: 2,
      type: '위험운전',
      icon: dangerIcon,
      licensePlate: '나5678',
      time: '2024-08-10 22:05:30',
      video: videoURL,
    },
    {
      id: 3,
      type: '과속운전',
      icon: speedIcon,
      licensePlate: '다9101',
      time: '2024-08-10 22:06:15',
      video: videoURL,
    },
  ];

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
    navigate('/live-cctv'); // cctvIcon 클릭 시 '/live-cctv' 경로로 이동합니다.
  };


  return (
    <div className="analysis-page">
      <div className="sidebar">
        <img src={logoImage} alt="로고" className="logo" />
        <h2 className="text_1">업로드영상 분석</h2>
        <ul className="record-list">
          <li className="menu-item" onClick={() => navigate('/record-db')}> {/* 클릭 시 navigate 사용 */}
            <img src={recordDBIcon} alt="단속기록 DB" className="recordDBIcon" />
            <span className="record_text">단속기록 DB</span>
          </li>
          <li className="menu-item" onClick={handleCCTVClick}> {/* cctvIcon 클릭 시 handleCCTVClick 실행 */}
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
