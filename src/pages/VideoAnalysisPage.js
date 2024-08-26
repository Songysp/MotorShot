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
  const [detectionSummary, setDetectionSummary] = useState({
    totalFrames: 0,
    totalNoHelmet: 0,
    totalOkHelmet: 0,
    framesWithNoHelmet: 0,
    averageNoHelmetPerFrame: 0,
    averageOkHelmetPerFrame: 0,
    percentFramesWithNoHelmet: 0
  });
  const navigate = useNavigate();
  const mainVideoRef = useRef(null);
  const originalVideoRef = useRef(null);
  const detectionVideoRefs = useRef([]);

  const processDetectionData = (data) => {
    let totalFrames = data.length;
    let totalNoHelmet = 0;
    let totalOkHelmet = 0;
    let framesWithNoHelmet = 0;

    const processedData = data.map((frame, index) => {
      const noHelmet = frame.no_helmets || 0;  // 'no_helmets'로 변경
      const okHelmet = frame.ok_helmets || 0;  // 'ok_helmets'로 변경
      
      totalNoHelmet += noHelmet;
      totalOkHelmet += okHelmet;
      if (noHelmet > 0) framesWithNoHelmet++;

      return {
        frame: index + 1,
        noHelmet: noHelmet,
        okHelmet: okHelmet,
        totalDetections: noHelmet + okHelmet,
      };
    });

    const summary = {
      totalFrames,
      totalNoHelmet,
      totalOkHelmet,
      framesWithNoHelmet,
      averageNoHelmetPerFrame: totalNoHelmet / totalFrames,
      averageOkHelmetPerFrame: totalOkHelmet / totalFrames,
      percentFramesWithNoHelmet: (framesWithNoHelmet / totalFrames) * 100
    };

    return { processedData, summary };
  };

  useEffect(() => {
    const fetchDetectedVehicles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/record', {
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzNmZTgwZTM4OTVjYjVjMTM2OTMyZSJ9._xtHfwaVOOJLilzauhdnuOMhB-xwJ3jPY4C9LjFk90k`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const { processedData, summary } = processDetectionData(data);
          setDetectedVehicles(processedData);
          setDetectionSummary(summary);
        } else {
          console.error('데이터를 가져오는 중 오류 발생:', response.statusText);
        }
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchDetectedVehicles();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const newVideoURL = URL.createObjectURL(file);
      setUploadedVideo(file.name);
      setVideoURL(newVideoURL);

      const formData = new FormData();
      formData.append('video', file);

      try {
        const response = await fetch('http://localhost:8080/detect', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('분석 결과:', data);

          const { processedData, summary } = processDetectionData(data);
          setDetectedVehicles(processedData);
          setDetectionSummary(summary);
        } else {
          console.error('분석 중 오류 발생:', response.statusText);
        }
      } catch (error) {
        console.error('분석 중 오류 발생:', error);
      }
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
          <DetectionFooter 
            helmetCount={detectionSummary.totalNoHelmet}
            dangerCount={detectionSummary.framesWithNoHelmet} 
            speedCount={detectionSummary.totalFrames} 
          />
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