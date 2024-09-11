const express = require("express");
const {
  login,
  register,
  user,
  updateAccount,
  changepassword,
  resetpassword,
  deluser,
  listAllUsers,
  logout

} = require("../controllers/auth");

const {
  Authenticated,
} = require("../middlewares/Authenticated");
const {
  isAuthorized,
  isAuthorizedAdmin,
  isAuthorizedAdminandTeacher,
  isAuthorizedAdminandUser
} = require("../middlewares/isAuthorized");
const authrouter = express.Router();

// http://localhost:3000/api/login
authrouter.post("/login", login);
// http://localhost:3000/api/register
authrouter.post("/register", register);
// http://localhost:3000/api/user/:uid
authrouter.post("/user/:uid", Authenticated, isAuthorized, user);
// http://localhost:3000/api/user/:uid

// update role account
authrouter.put("/user/:uid", Authenticated, isAuthorizedAdmin, updateAccount);
// http://localhost:3000/api/changepassword/:uid
authrouter.put("/changepassword/:uid", Authenticated, isAuthorized, changepassword);
// http://localhost:3000/api/resetpassword/:uid
authrouter.post("/resetpassword/:uid", Authenticated, isAuthorizedAdmin, resetpassword);
// http://localhost:3000/api/user/:uid
authrouter.delete("/user/:uid", Authenticated, isAuthorizedAdmin, deluser);
// http://localhost:3000/api/listAllUsers
authrouter.get("/listAllUsers",Authenticated, isAuthorizedAdminandTeacher, listAllUsers);
// http://localhost:3000/api/logout
authrouter.get("/logout", logout);


module.exports = {
  authroutes: authrouter
};
