import React from 'react';

function DetectedVehicleList({ detectedVehicles, detectionVideoRefs, sampleImage }) {
    return (
        <div className="detection-summary">
            <h3>단속차량</h3>
            {detectedVehicles.map((vehicle, index) => (
                <div key={vehicle.id} className="detection-item">
                    <div className="video-container">
                        <div className="overlay">
                            <img src={vehicle.icon} alt={`${vehicle.type} 아이콘`} className="vehicle-icon" />
                            <p className="vehicle-license">{vehicle.licensePlate}</p>
                            <p className="vehicle-time">{vehicle.time}</p>
                        </div>
                        {vehicle.video ? (
                            <video
                                ref={el => (detectionVideoRefs.current[index] = el)}
                                className="thumbnail"
                                controls
                            >
                                <source src={vehicle.video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img src={sampleImage} alt="Detection Video" className="thumbnail" />
                        )}

                    </div>
                </div>
            ))}
        </div>
    );
}

export default DetectedVehicleList;



