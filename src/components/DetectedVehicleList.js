import React from 'react';
import '../styles/DetectedVehicleList.css';

function DetectedVehicleList({ detectedVehicles, detectionVideoRefs, sampleImage }) {
    return (
        <div className="vehicle-detection-summary">
            <h3>단속차량</h3>
            {detectedVehicles.map((vehicle, index) => (
                <div key={vehicle.id} className="vehicle-detection-item">
                    <div className="vehicle-video-container">
                        <div className="vehicle-overlay">
                            <img src={vehicle.icon} alt={`${vehicle.type} 아이콘`} className="vehicle-icon" />
                            <p className="vehicle-license">{vehicle.licensePlate}</p>
                            <p className="vehicle-time">{vehicle.time}</p>
                        </div>
                        {vehicle.video ? (
                            <video
                                ref={el => (detectionVideoRefs.current[index] = el)}
                                className="vehicle-thumbnail"
                                controls
                            >
                                <source src={vehicle.video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img src={sampleImage} alt="Detection Video" className="vehicle-thumbnail" />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DetectedVehicleList;

