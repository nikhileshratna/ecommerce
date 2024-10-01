const uploadCarouselPermission = require('../../helpers/permission');
const carouselModel = require('../../models/carouselModel');

async function deleteCarouselController(req, res) {
    try {
        // Check if the user has permission to delete carousel items
        if (!uploadCarouselPermission(req.userId)) {
            throw new Error("Permission denied");
        }

        // Extract the carousel item ID from the request body
        const { _id } = req.body;

        // Find the carousel item by ID
        const carouselToDelete = await carouselModel.findById(_id);

        if (!carouselToDelete) {
            throw new Error("Carousel item not found");
        }

        // Delete the carousel item
        const deletedCarousel = await carouselModel.findByIdAndDelete(_id);

        if (!deletedCarousel) {
            throw new Error("Carousel deletion failed");
        }

        // Respond with success
        res.json({
            message: "Carousel item deleted successfully",
            data: deletedCarousel,
            success: true,
            error: false
        });
    } catch (err) {
        // Handle errors and send response
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = deleteCarouselController;
