import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SummaryApi from '../common';

const TrackOrder = () => {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [trackingData, setTrackingData] = useState(null);
    const EMAIL = process.env.REACT_APP_SHIPROCKET_EMAIL;
    const PASSWORD = process.env.REACT_APP_SHIPROCKET_PASS;

    const trackOrderFunc = async (shipment_id) => {
        
        setLoading(true);

        try {
            const response = await fetch(SummaryApi.trackOrder.url, {
              method: SummaryApi.trackOrder.method,
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ shipment_id }),
            });
      

        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            trackOrderFunc(params.id);
        }
    }, [params.id]);

    return (
        <div className="container mx-auto p-4">
            {loading ? (
                <p>Loading...</p>
            ) : trackingData ? (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Track Order</h1>
                    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                        <h2 className="text-xl font-semibold mb-2">Shipment Details</h2>
                        <p><strong>Status:</strong> {trackingData.shipment_track[0]?.current_status}</p>
                        <p><strong>Tracking URL:</strong> <a href={trackingData.track_url} target="_blank" rel="noopener noreferrer">{trackingData.track_url}</a></p>
                        <p><strong>Estimated Delivery Date:</strong> {trackingData.etd}</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <h2 className="text-xl font-semibold mb-2">Tracking Activities</h2>
                        <ul>
                            {trackingData.shipment_track_activities.map((activity, index) => (
                                <li key={index} className="mb-2">
                                    <p><strong>Date:</strong> {activity.date}</p>
                                    <p><strong>Status:</strong> {activity.status}</p>
                                    <p><strong>Activity:</strong> {activity.activity}</p>
                                    <p><strong>Location:</strong> {activity.location}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <h1>No Tracking Data Available</h1>
            )}
        </div>
    );
};

export default TrackOrder;
