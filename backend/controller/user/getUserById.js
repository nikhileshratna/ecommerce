const userModel = require("../../models/userModel");

async function userDetailsByIdController(req, res) {
    try {
        // Extract userId from the request body
        const { userId } = req.body;

        // Check if userId is provided
        if (!userId) {
            return res.status(400).json({
                message: "User ID not provided",
                error: true,
                success: false
            });
        }

        // Find the user by userId and populate additionalDetails
        const user = await userModel.findById(userId).populate("additionalDetails").exec();

        // Check if user is found
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Send the response with user data
        res.status(200).json({
            data: user,
            error: false,
            success: true,
            message: "User details retrieved successfully"
        });

    } catch (err) {
        // Handle errors
        res.status(500).json({
            message: err.message || "An error occurred",
            error: true,
            success: false
        });
    }
}

module.exports = userDetailsByIdController;
