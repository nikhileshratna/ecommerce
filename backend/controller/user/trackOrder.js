const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const trackOrder = async (req, res) => {
    const EMAIL = process.env.SHIPROCKET_EMAIL;
    const PASSWORD = process.env.SHIPROCKET_PASS;
    const { id: shipment_id } = req.params;
    const shiprocketURL = "https://apiv2.shiprocket.in/v1/external";

    console.log("Shipment ID:", shipment_id);

    try {
        // Login to Shiprocket
        const loginResponse = await fetch(`${shiprocketURL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD })
        });

        if (!loginResponse.ok) {
            return res.status(401).json({ message: 'Login failed' });
        }

        const loginData = await loginResponse.json();
        const shiprocketToken = loginData.token;

        if (!shiprocketToken) {
            return res.status(401).json({ message: 'Invalid login response' });
        }

        // Use the token to track the order using the shipment_id
        const trackResponse = await fetch(`${shiprocketURL}/courier/track/shipment/${shipment_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${shiprocketToken}`
            }
        });

        if (!trackResponse.ok) {
            return res.status(400).json({ message: 'Tracking failed' });
        }

        const trackData = await trackResponse.json();
        console.log("Tracking data:", trackData);

        // Send tracking data to frontend
        res.json(trackData);

        // Logout from Shiprocket
        await fetch(`${shiprocketURL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${shiprocketToken}`
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = trackOrder;
