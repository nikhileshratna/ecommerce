const userModel = require("../../models/userModel");
const Profile = require("../../models/Profile");

async function updateWishlistController(req, res) {
    try {
        const userId = req.userId;
        const { productId, action } = req.body; // Expecting productId and action (add or remove)

        if (!userId || !productId || !action) {
            return res.status(400).json({
                message: "User ID, Product ID, and action (add/remove) are required",
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

        // Find or create the user's profile
        let profile;
        if (user.additionalDetails) {
            profile = await Profile.findById(user.additionalDetails);
            if (!profile) {
                return res.status(400).json({
                    message: "Profile associated with user not found",
                    error: true,
                    success: false,
                });
            }
        } else {
            return res.status(400).json({
                message: "Profile not found",
                error: true,
                success: false,
            });
        }

        // Update the wishlist based on the action
        if (action === "add") {
            // Check if product is already in the wishlist
            const alreadyInWishlist = profile.wishlist.some(item => item.productId.equals(productId));
            if (alreadyInWishlist) {
                return res.status(400).json({
                    message: "Product is already in the wishlist",
                    error: true,
                    success: false,
                });
            }

            // Add product to wishlist
            profile.wishlist.push({ productId });
        } else if (action === "remove") {
            // Remove product from wishlist
            profile.wishlist = profile.wishlist.filter(item => !item.productId.equals(productId));
        } else {
            return res.status(400).json({
                message: "Invalid action. Use 'add' or 'remove'.",
                error: true,
                success: false,
            });
        }

        // Save the updated profile
        await profile.save();

        res.status(200).json({
            message: `Product ${action === "add" ? "added to" : "removed from"} wishlist successfully`,
            data: profile.wishlist,
            error: false,
            success: true,
        });

    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(400).json({
            message: "An error occurred while updating wishlist",
            error: true,
            success: false,
        });
    }
}

module.exports = updateWishlistController;
