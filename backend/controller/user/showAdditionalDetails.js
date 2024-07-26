const userModel = require("../../models/userModel");
const Profile = require("../../models/Profile"); // Adjust the path as needed

async function fetchUserAdditionalDetailsController(req, res) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({
                message: "User ID not found",
                error: true,
                success: false,
            });
        }

        // Find the user by ID
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        // Check if additionalDetails exists
        if (!user.additionalDetails) {
            return res.status(200).json({
                message: "No additional details found for this user",
                data: null,
                error: false,
                success: true,
            });
        }

        // Fetch the Profile document
        const profile = await Profile.findById(user.additionalDetails);

        if (!profile) {
            return res.status(400).json({
                message: "Profile associated with user not found",
                error: true,
                success: false,
            });
        }

        res.status(200).json({
            data: profile,
            error: false,
            success: true,
            message: "Additional details fetched successfully",
        });
    } catch (err) {
        res.status(400).json({
            message: "An error occurred while fetching additional details",
            error: true,
            success: false,
        });
    }
}

module.exports = fetchUserAdditionalDetailsController;
