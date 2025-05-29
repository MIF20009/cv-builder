const {User} = require('../models/User'); // assuming Mongoose model
const {Education} = require('../models/Education');
const {Experience} = require('../models/Experience');

const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching dashboard for userId:", userId);

    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const education = await Education.findAll({ where: { userId } });
    const experience = await Experience.findAll({ where: { userId } });

    res.json({
      user,
      education,
      experience,
      cvUrl: user.cvUrl
    });
  } catch (err) {
    console.error("Error in getUserDashboard:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


module.exports = { getUserDashboard };
