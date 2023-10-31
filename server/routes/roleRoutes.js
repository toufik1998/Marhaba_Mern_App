const express = require("express");
const {getAllRoles} = require("../controllers/roleController");
const router = express.Router();


router.get("/get-all-routes", getAllRoles);


module.exports = router