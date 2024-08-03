const userModel = require("../../models/userModel");
const Profile = require("../../models/Profile"); 
async function updateUserDetailsController(req, res) {
    try {
        const userId = req.userId;
        console.log("userId", userId);

        const { 
            gender = "", 
            dateOfBirth = "", 
            address1 = "", 
            address2 = "", 
            city = "", 
            pincode = "", 
            state = "", 
            country = "", 
            contactNumber = "" 
        } = req.body;

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
                address1,
                address2,
                city,
                pincode,
                state,
                country,
                contactNumber,
            });
            await profile.save();

            // Associate the new Profile with the user
            user.additionalDetails = profile._id;
        }

        // Update the Profile document
        profile.gender = gender || profile.gender;
        profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
        profile.address1 = address1 || profile.address1;
        profile.address2 = address2 || profile.address2;
        profile.city = city || profile.city;
        profile.pincode = pincode || profile.pincode;
        profile.state = state || profile.state;
        profile.country = country || profile.country;
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
        console.error(err); // Log the error for debugging
        res.status(400).json({
            message: "An error occurred while updating user details",
            error: true,
            success: false,
        });
    }
}

module.exports = updateUserDetailsController;
