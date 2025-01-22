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
exports.fetchUserName = async (req, res) => {
  try {
      const user = await User.findById(req.params.id).select('username')  
      res.json({ success: true, name: user.username });
  } catch (error) {
      console.log(error)
      res.json({ success: false, message: "User not found", error });
  }
}