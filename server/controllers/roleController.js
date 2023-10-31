const UserModel = require("../models/User");
const RoleModel = require("../models/Role");

const getAllRoles = async (req, res) => {
    try {
        const roles = await RoleModel.find();
        res.json(roles);
      } catch (error) {
        res.status(500).json({ message: "Failed to retrieve roles" });
    }
}


module.exports = {getAllRoles};