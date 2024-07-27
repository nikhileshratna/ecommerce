const userModel = require("../../models/userModel");
const Profile = require("../../models/Profile"); // Adjust the path as needed

async function updateUserDetailsController(req, res) {
    try {
        const userId = req.userId;
        console.log("userId", userId);
        const { 
            gender = "", 
            dateOfBirth = "", 
            address = "", 
            contactNumber = "" } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: `User ID not found hui ${userId}`,
                error: true,
                success: false,
            });
        }

        // Find the user
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        let profile;

        // Check if additionalDetails exists
        if (user.additionalDetails) {
            // If additionalDetails exists, find the corresponding Profile
            profile = await Profile.findById(user.additionalDetails);
            if (!profile) {
                return res.status(400).json({
                    message: "Profile associated with user not found",
                    error: true,
                    success: false,
                });
            }
        } else {
            // If additionalDetails does not exist, create a new Profile
            profile = new Profile({
                gender,
                dateOfBirth,
                address,
                contactNumber,
            });
            await profile.save();

            // Associate the new Profile with the user
            user.additionalDetails = profile._id;
        }

        // Update the Profile document
        profile.gender = gender || profile.gender;
        profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
        profile.address = address || profile.address;
        profile.contactNumber = contactNumber || profile.contactNumber;
        await profile.save();

        // Save the updated user
        await user.save();

        res.status(200).json({
            data: user,
            error: false,
            success: true,
            message: "User details updated successfully",
        });
    } catch (err) {
        res.status(400).json({
            message: "An error occurred while updating user details",
            error: true,
            success: false,
        });
    }
}

module.exports = updateUserDetailsController;
