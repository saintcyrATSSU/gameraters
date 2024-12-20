const express = require("express");
const app = express();
const cors = require('cors')
const loginRoute = require('./routes/userLogin')
const getAllUsersRoute = require('./routes/userGetAllUsers')
const registerRoute = require('./routes/userSignUp')
const getUserByIdRoute = require('./routes/userGetUserById')
const dbConnection = require('./config/db.config')
const editUser = require('./routes/userEditUser')
const deleteUser = require('./routes/userDeleteAll')
const gameDetails = require('./routes/gamesdetails')
const commentRoutes = require('./routes/commentRoutes')
const NotificationRoutes = require('./routes/NotificationRoutes');
const getProfileImage = require('./routes/user.getProfileImage');
const reviewRoutes = require('./routes/reviewRoutes');
const path = require("path");
 

require('dotenv').config();
const SERVER_PORT = 8081

dbConnection()
app.use(cors({origin: '*'}))
app.use(express.json())
app.use('/user', loginRoute)
app.use('/user', registerRoute)
app.use('/user', getAllUsersRoute)
app.use('/user', getUserByIdRoute)
app.use('/user', editUser)
app.use('/user', deleteUser)
app.use('/games', gameDetails)
app.use('/comments', commentRoutes)
//app.use('/routes/', NotificationRoutes)
app.use('/user', getProfileImage)
app.use('/reviews', reviewRoutes);
app.use("/api", gameDetails);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(SERVER_PORT, (req, res) => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
})

module.export = app;