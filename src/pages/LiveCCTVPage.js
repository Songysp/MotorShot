import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate를 import합니다.

import '../styles/LiveCCTVPage.css'; // 새로운 CSS 파일을 import합니다.
import sampleImage from '../assets/images/sample_video.png';
import helmetIcon from '../assets/images/helmet.png';
import dangerIcon from '../assets/images/danger.png';
import speedIcon from '../assets/images/speed.png';
import recordDBIcon from '../assets/images/Group 46.png';
import cctvIcon_big from '../assets/images/cctv_big.png';
import video_small from '../assets/images/video_small.png';
import bikeIcon from '../assets/images/image.png';
import DetectionFooter from '../components/DetectionFooter';
import DetectedVehicleList from '../components/DetectedVehicleList';

function LiveCCTVPage() {
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

  const handleVideoUploadClick = () => {
    navigate('/analysis'); // video_small 클릭 시 '/analysis' 경로로 이동합니다.
  };

  return (
    <div className="cctv-analysis-page">
      <div className="cctv-sidebar">
        <img src={cctvIcon_big} alt="로고" className="cctv-logo" />
        <h2 className="cctv-text_1">실시간 CCTV</h2>
        <ul className="cctv-record-list">
          <li className="cctv-menu-item">
            <img src={recordDBIcon} alt="단속기록 DB" className="cctv-recordDBIcon" />
            <span className="cctv-record_text">단속기록 DB</span>
          </li> 
          <li className="cctv-menu-item" onClick={handleVideoUploadClick}> {/* 클릭 시 handleVideoUploadClick 실행 */}
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
            <span>{uploadedVideo ? uploadedVideo : 'sample_video.mp4'}</span>
            <input
              type="file"
              accept="video/*"
              style={{ display: 'none' }}
              id="file-upload"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cctv-upload-button">
              동영상 업로드 ⬆
            </label>
          </div>
          <div className="cctv-video-container-video-page">
            {videoURL ? (
              <video ref={mainVideoRef} className="cctv-video-frame" controls>
                <source src={videoURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={sampleImage} alt="Sample Video" className="cctv-video-frame" />
            )}
            <div className="cctv-video-controls">
              <button onClick={() => mainVideoRef.current && mainVideoRef.current.play()}>◀</button>
              <button onClick={() => mainVideoRef.current && mainVideoRef.current.pause()}>⏸</button>
              <button onClick={() => mainVideoRef.current && mainVideoRef.current.play()}>▶</button>
              <span>04:32 / 08:00</span>
            </div>
          </div>
          <DetectionFooter helmetCount={'04'} dangerCount={'01'} speedCount={2} />
        </div>

        <div className="cctv-right-sidebar">
          <div className="cctv-video-thumbnail">
            <h3>원본영상</h3>
            {videoURL ? (
              <video ref={originalVideoRef} className="cctv-thumbnail" controls>
                <source src={videoURL} type="video/mp4" />
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
