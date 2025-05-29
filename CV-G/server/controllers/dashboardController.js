const User = require('../models/User'); // assuming Mongoose model
const Education = require('../models/Education');
const Experience = require('../models/Experience');

const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] }});
    const education = await Education.findAll({ where: { userId } });
    const experience = await Experience.findAll({ where: { userId } });

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
