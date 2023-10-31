const express = require("express");
const connectDb = require("./config/connectDb")
const dotenv = require('dotenv').config();
const cors = require("cors")
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/authRoutes")
const clientRoutes = require("./routes/clientRoutes")
const deliveryRoutes = require("./routes/deliveryRoutes")
const managerRoutes = require("./routes/managerRoutes")
const roleRoutes = require("./routes/roleRoutes")
const swagger = require("./swagger")

connectDb();

const app = express();
const port =  process.env.PORT || 5555;

// swagger
swagger(app);

app.use(express.json());
app.use(cookieParser());


// Cors Policy
app.use(cors());

// load routes
app.use("/api/auth", authRoutes);
app.use("/api/user", clientRoutes);
app.use("/api/user", deliveryRoutes);
app.use("/api/user", managerRoutes)

app.use("/api/role", roleRoutes)


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})