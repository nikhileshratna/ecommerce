import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TrackOrder = () => {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const EMAIL = process.env.REACT_APP_SHIPROCKET_EMAIL;
    const PASSWORD = process.env.REACT_APP_SHIPROCKET_PASS;
    const trackOrderFunc = async (shipment_id) => {
        const shiprocketURL = "https://apiv2.shiprocket.in/v1/external";
        setLoading(true);

        try {
            const loginResponse = await fetch(`${shiprocketURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": EMAIL,
                    "password": PASSWORD
                })
            });

            const loginData = await loginResponse.json();
            const shiprocketToken = loginData.token;

            if (!loginResponse.ok || !shiprocketToken) {
                throw new Error('Login failed');
            }

            // Use the token to track the order using the shipment_id
            const trackResponse = await fetch(`${shiprocketURL}/orders/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${shiprocketToken}`
                },
                body: JSON.stringify({ shipment_id })
            });

            const trackData = await trackResponse.json();
            console.log('Track Data:', trackData);

            if (!trackResponse.ok) {
                throw new Error('Tracking failed');
            }
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log(PASSWORD);
        console.log(EMAIL);
        if (params.id) {
            trackOrderFunc(params.id);
        }
    }, [params.id]);

    return (
        <div>
            {loading ? <p>Loading...</p> : <h1>Track Order</h1>}
        </div>
    );
};

export default TrackOrder;
