const {User} = require('../models/User'); // assuming Mongoose model
const {Education} = require('../models/Education');
const {Experience} = require('../models/Experience');

const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching dashboard for userId:", userId);

    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const education = await Education.findAll({ where: { user_id: userId } });
    const experience = await Experience.findAll({ where: { user_id: userId } });

    res.json({
      user,
      education,
      experience,
      cvUrl: user.cv_url  // snake_case here
    });
  } catch (err) {
    console.error("Error in getUserDashboard:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



module.exports = { getUserDashboard };
