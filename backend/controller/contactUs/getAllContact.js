const contactUsModel = require("../../models/contactUs");

async function GetAllContactsController(req, res) {
    try {
        // Fetch all contact entries from the database
        const contacts = await contactUsModel.find();

        if (!contacts.length) {
            return res.status(404).json({
                message: "No contacts found",
                error: false,
                success: true,
                data: []
            });
        }

        // Return the fetched contact entries
        res.status(200).json({
            message: "Contacts retrieved successfully",
            error: false,
            success: true,
            data: contacts
        });
        
    } catch (err) {
        res.status(500).json({
            message: err.message || "An error occurred while fetching contacts",
            error: true,
            success: false
        });
    }
}

module.exports = GetAllContactsController;
