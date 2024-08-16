import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/RecordDBPage.module.css';
import recordDBIcon from '../assets/images/Group 46.png';

import cctvIcon_Small from '../assets/images/Group 65.png';
import video_small from '../assets/images/video_small.png';
import bikeIcon from '../assets/images/image.png';
import helmetIcon from '../assets/images/helmet.png';
import dangerIcon from '../assets/images/danger.png';
import speedIcon from '../assets/images/speed.png';
import sampleImage from '../assets/images/sample_video.png';
import DetectionFooter from '../components/DetectionFooter';
import DetectedVehicleList from '../components/DetectedVehicleList';

function RecordDBPage() {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const detectedVehicles = [
    { id: '0001', type: '헬멧미착용', licensePlate: '경기성남 가1234', time: '2024-08-08 18:06:34', image: sampleImage, icon: 'helmetIcon' },
    { id: '0002', type: '속도위반', licensePlate: '경기성남 나1134', time: '2024-08-08 18:17:14', image: sampleImage, icon: 'speedIcon' },
    { id: '0003', type: '헬멧미착용', licensePlate: '서울강남 가0232', time: '2024-08-08 18:58:04', image: sampleImage, icon: 'helmetIcon' },
    { id: '0004', type: '헬멧미착용', licensePlate: '충남아산 다1114', time: '2024-08-08 19:10:38', image: sampleImage, icon: 'helmetIcon' },
    { id: '0005', type: '위험운전', licensePlate: '경기기흥 가1030', time: '2024-08-08 19:46:24', image: sampleImage, icon: 'dangerIcon' },
    { id: '0006', type: '위험운전', licensePlate: '서울서초 라9834', time: '2024-08-08 20:06:01', image: sampleImage, icon: 'dangerIcon' },
    { id: '0007', type: '헬멧미착용', licensePlate: '서울강남 마1254', time: '2024-08-08 22:34:44', image: sampleImage, icon: 'helmetIcon' },
  ];

  const filteredVehicles = detectedVehicles.filter(vehicle =>
    vehicle.licensePlate.includes(searchQuery)
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'normal': return helmetIcon;
      case 'warning': return dangerIcon;
      case 'danger': return speedIcon;
      default: return helmetIcon;
    }
  };

  const helmetCount = detectedVehicles.filter(v => v.type === '헬멧미착용').length;
  const dangerCount = detectedVehicles.filter(v => v.type === '위험운전').length;
  const speedCount = detectedVehicles.filter(v => v.type === '속도위반').length;

  const handleCCTVClick = () => {
    navigate('/live-cctv');
  };

  const handleVideoUploadClick = () => {
    navigate('/analysis');
  };

  return (
    <div className={styles.recordDbPage}>
      <div className={styles.sidebar}>
        <img src={recordDBIcon} alt="로고" className={styles.logo} />
        <h2 className={styles.dbTitle}>단속기록 DB</h2>
        <ul className={styles.recordList}>
          <li className={styles.menuItem} onClick={handleCCTVClick}>
            <img src={cctvIcon_Small} alt="단속기록 DB" className={styles.menuIcon} />
            <span className={styles.cctvText}>실시간 CCTV</span>
          </li>
          <li className={styles.menuItem} onClick={handleVideoUploadClick}>
            <img src={video_small} alt="영상업로드 전환" className={styles.menuIcon} />
            <span className={styles.uploadText}>영상업로드 전환</span>
          </li>
        </ul>
        <img src={bikeIcon} alt="오토바이 아이콘" className={styles.bikeIcon} />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h2>sample_video.mp4</h2>
          <div className={styles.headerRight}>
            <input
              type="text"
              placeholder="차량번호 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <div className={styles.headerIcons}>
              <img src={helmetIcon} alt="Helmet" />
              <img src={dangerIcon} alt="Danger" />
              <img src={speedIcon} alt="Speed" />
            </div>
          </div>
        </div>

        <div className={styles.recordTable}>
          <table>
            <thead>
              <tr>
                <th>단속번호 id</th>
                <th>단속유형</th>
                <th>차량번호</th>
                <th>단속시간</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} onClick={() => setSelectedVehicle(vehicle)}>
                  <td>{vehicle.id}</td>
                  <td>{vehicle.type}</td>
                  <td>{vehicle.licensePlate}</td>
                  <td>{vehicle.time}</td>
                  <td><img src={getStatusIcon(vehicle.status)} alt={vehicle.status} className={styles.statusIcon} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedVehicle && (
          <div className={styles.selectedVehicleInfo}>
            <h3>단속번호: {selectedVehicle.id}</h3>
            <p>유형: {selectedVehicle.type}</p>
            <p>차량번호: {selectedVehicle.licensePlate}</p>
            <p>시간: {selectedVehicle.time}</p>
          </div>
        )}

        <DetectionFooter helmetCount={helmetCount} dangerCount={dangerCount} speedCount={speedCount} />
      </div>

      <div className={styles.rightSidebar}>
        <DetectedVehicleList
          detectedVehicles={detectedVehicles}
          detectionVideoRefs={[]}
          sampleImage={sampleImage}
        />
      </div>
    </div>
  );
}

export default RecordDBPage;
