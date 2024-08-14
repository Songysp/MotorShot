import React, { useState, useEffect } from 'react';
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
  const [cctvVideoURL, setCctvVideoURL] = useState('');
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 얻습니다.

  const detectedVehicles = [
    {
      id: 1,
      type: '헬멧미착용',
      icon: helmetIcon,
      licensePlate: '가1234',
      time: '2024-08-10 22:04:45',
      video: cctvVideoURL, // CCTV 영상의 URL을 사용합니다.
    },
    {
      id: 2,
      type: '위험운전',
      icon: dangerIcon,
      licensePlate: '나5678',
      time: '2024-08-10 22:05:30',
      video: cctvVideoURL,
    },
    {
      id: 3,
      type: '과속운전',
      icon: speedIcon,
      licensePlate: '다9101',
      time: '2024-08-10 22:06:15',
      video: cctvVideoURL,
    },
    {
      id: 4,
      type: '과속운전',
      icon: speedIcon,
      licensePlate: '라9101',
      time: '2024-08-10 22:06:15',
      video: cctvVideoURL,
    },
  ];

  useEffect(() => {
    // 여기에 CCTV 데이터를 API로부터 가져오는 코드를 작성합니다.
    // 예시로, CCTV 영상의 URL을 가져온다고 가정하겠습니다.
    async function fetchCCTVData() {
      try {
        // 예시 URL, 실제 API 엔드포인트로 변경해야 합니다.
        const response = await fetch('https://api.example.com/cctv-url');
        const data = await response.json();
        setCctvVideoURL(data.url); // 받아온 CCTV 영상 URL을 저장합니다.
      } catch (error) {
        console.error('CCTV 데이터를 가져오는데 실패했습니다.', error);
        setCctvVideoURL(''); // CCTV 데이터를 가져오지 못했을 경우 빈 문자열로 설정
      }
    }

    fetchCCTVData();
  }, []);

  const handleVideoUploadClick = () => {
    navigate('/analysis'); // 영상업로드 전환 버튼 클릭 시 '/analysis' 경로로 이동합니다.
  };

  return (
    <div className="cctv-analysis-page">
      <div className="cctv-sidebar">
        <img src={cctvIcon_big} alt="로고" className="cctv-logo" />
        <h2 className="cctv-text_1">실시간 CCTV</h2>
        <ul className="cctv-record-list">
          <li className="cctv-menu-item" onClick={() => navigate('/record-db')}> {/* 클릭 시 navigate 사용 */}
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
            <span>경부 고속도로</span>
          </div>
          <div className="cctv-video-container-video-page">
            {cctvVideoURL ? (
              <video className="cctv-video-frame" controls>
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
              <video className="cctv-thumbnail" controls>
                <source src={cctvVideoURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={sampleImage} alt="Original Video" className="cctv-thumbnail" />
            )}
          </div>
          <DetectedVehicleList 
            detectedVehicles={detectedVehicles} 
            detectionVideoRefs={[]} // 빈 배열로 설정 (해당 부분이 필요할 경우 변경 가능)
            sampleImage={sampleImage} 
          />
        </div>
      </div>
    </div>
  );
}

export default LiveCCTVPage;
