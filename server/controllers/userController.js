const User = require("../models/User");

// userController.js
exports.searchUsers = async (req, res) => {
  const searchQuery = req.query.query;
  try {
    const users = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: searchQuery, $options: "i" } },
            { email: { $regex: searchQuery, $options: "i" } },
          ],
        },
        { _id: { $ne: req.user._id } }, // Filter to exclude documents with req.user._id
      ],
    });
    res.json({ success: true, users });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error searching users", error });
  }
};
