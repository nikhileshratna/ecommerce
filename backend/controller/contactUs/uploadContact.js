const contactUsModel = require("../../models/contactUs"); // Assuming the model file is named contactUsModel.js

async function UploadContactController(req, res) {
    try {
        const sessionUserId = req.userId;

        // Check if the user is logged in (assuming the presence of sessionUserId indicates a logged-in user)
        if (!sessionUserId) {
            throw new Error("User not logged in");
        }

        const { name, email, comment } = req.body;

        // Validate required fields
        if (!name || !email || !comment) {
            throw new Error("Name, email, and comment are required");
        }

        // Create a new contact entry
        const contactEntry = new contactUsModel({
            userId: sessionUserId,
            name,
            email,
            comment
        });

        // Save the contact entry to the database
        const savedContact = await contactEntry.save();

        // Return a successful response
        res.status(201).json({
            message: "Contact submitted successfully",
            error: false,
            success: true,
            data: savedContact
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = UploadContactController;
