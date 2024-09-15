const userSchema = require("../../models/userModel");
const Profile = require("../../models/Profile");
const orderModel = require("../../models/orderModel");

const updateMyOrders = async (req, res) => {
  const userId = req.userId;
  const { orders, shipment_id } = req.body;

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
        dateOfBirth: "",
        address1: "",
        contactNumber: "",
        myOrders: [],
      });
      await profile.save();

      // Associate the new Profile with the user
      user.additionalDetails = profile._id;
      await user.save();
    }

    profile = await Profile.findById(user.additionalDetails);

    // Iterate over each order and add to myOrders in the profile
    for (let order of orders) {
      const orderDetails = await orderModel.findById(order?.orderId);

      if (!orderDetails) {
        return res.status(400).json({
          message: "Order not found",
          error: true,
          success: false,
        });
      }

      profile.myOrders.push({
        orderId: orderDetails._id,
        shipment_id: shipment_id
      });
    }

    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateMyOrders };
