const uploadCarouselPermission = require("../../helpers/permission");
const carouselModel = require("../../models/carouselModel");

async function UploadCarouselController(req, res) {
    try {
        const sessionUserId = req.userId;

        // Check permission
        if (!uploadCarouselPermission(sessionUserId)) {
            throw new Error("Permission denied");
        }

        // Extract carousel data from the request body
        const { name, productImage } = req.body;

        // Validate the inputs (you can add more validation if needed)
        if (!name || !productImage) {
            throw new Error("Name and product image are required");
        }

        // Upload and save the carousel item
        const uploadCarousel = new carouselModel({ name, productImage });
        const saveCarousel = await uploadCarousel.save();

        // Respond with success
        res.status(201).json({
            message: "Carousel item uploaded successfully",
            error: false,
            success: true,
            data: saveCarousel
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = UploadCarouselController;
