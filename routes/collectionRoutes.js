const express = require("express");
const {
  addCollection,
  getAllCollection,
  getCollection,
  updateCollection,
  deleteCollection,
  addsubjecttype,
  putsubjecttype,
  deletesubjecttype,
  deletesubjectid,
  getEmailCollection
} = require("../controllers/collectionController");
const {
  Authenticated,
} = require("../middlewares/Authenticated");
const {
  isAuthorized,
  isAuthorizedAdmin,
  isAuthorizedAdminandTeacher,
  isAuthorizedAdminandUser
} = require("../middlewares/isAuthorized");

const router = express.Router();


router.get("/emailcollection",Authenticated, isAuthorizedAdmin, getEmailCollection)
// http://localhost:3000/api/collection
router.post("/collection/:uid", Authenticated, isAuthorizedAdminandUser, addCollection);
// http://localhost:3000/api/allcollection
router.get("/allcollection", Authenticated, isAuthorizedAdminandTeacher, getAllCollection);
// http://localhost:3000/api/collection/userid
router.get("/collection/:uid", Authenticated, isAuthorized, getCollection);
// http://localhost:3000/api/collection/:uid
router.delete("/collection/:uid", Authenticated, isAuthorizedAdmin, deleteCollection);

router.post("/collection/:uid/:subject/:type", addsubjecttype);
// http://localhost:3000/api/collection/:uid/:subject/:type/:id
router.put("/collection/:uid", Authenticated, isAuthorizedAdminandUser, updateCollection);
// http://localhost:3000/api/collection/:uid
router.put("/collection/:uid/:subject/:type/:id", Authenticated, isAuthorizedAdminandUser, putsubjecttype);

router.delete("/collection/:uid/:subject/:type/:id", Authenticated, isAuthorizedAdminandUser, deletesubjecttype);
router.delete("/collection/:uid/:subject/:id", Authenticated, isAuthorizedAdminandUser, deletesubjectid)


module.exports = {
  routes: router
};