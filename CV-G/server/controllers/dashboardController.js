const User = require('../models/User'); // assuming Mongoose model
const Education = require('../models/Education');
const Experience = require('../models/Experience');

const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');
    const education = await Education.find({ user: userId });
    const experience = await Experience.find({ user: userId });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      user,
      education,
      experience,
      cvUrl: user.cvUrl // stored in DB when uploaded to Supabase
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getUserDashboard };
