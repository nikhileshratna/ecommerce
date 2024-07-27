const userSchema = require("../../models/userModel");
const Profile = require("../../models/Profile");

const updateMyOrders = async (req, res) => {
  const userId = req.userId;
  const { products } = req.body;

  try {
    const user = await userSchema.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
        gender: "",
        dateOfBirth : "",
        address : "",
        contactNumber   : "",
        myOrders: [],
      });
      await profile.save();

      // Associate the new Profile with the user
      user.additionalDetails = profile._id;
      await user.save();
    }

    profile = await Profile.findById(user.additionalDetails);

    products.forEach((product) => {
      profile.myOrders.push({
        productId: product._id,
        quantity: product.quantity,
      });
    });

    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateMyOrders };
