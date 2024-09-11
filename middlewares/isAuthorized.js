const admin = require("../db");
const getAuth = admin.auth();

const isAuthorized = async (req, res, next) => {
  try {
    const { role, email, uid } = res.locals
    const id = req.params.uid;
    const userRecord = await getAuth.getUserByEmail(email);
    if (role && userRecord.customClaims.role == 'admin' && uid == userRecord.uid || role && userRecord.customClaims.role == 'teacher' && uid == userRecord.uid || uid && id == userRecord.uid) {
      next();
    }
    else {
      return res.status(401).send("Access denied");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const isAuthorizedAdmin = async (req, res, next) => {
  try {
    const { role, email, uid } = res.locals
    const id = req.params.uid;
    const userRecord = await getAuth.getUserByEmail(email);
    if (role && userRecord.customClaims.role == 'admin' && uid == userRecord.uid) {
      next();
    }
    else {
      return res.status(401).send("Access denied");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const isAuthorizedAdminandTeacher = async (req, res, next) => {
  try {
    const { role, email, uid } = res.locals
    const id = req.params.uid;
    const userRecord = await getAuth.getUserByEmail(email);
    if (
      (role && userRecord.customClaims.role == 'admin' && uid == userRecord.uid) ||
      (role && userRecord.customClaims.role == 'teacher' && uid == userRecord.uid)
    ) {
      next();
    }
    else {
      return res.status(401).send("Access denied");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const isAuthorizedAdminandUser = async (req, res, next) => {
  try {
    const { role, email, uid } = res.locals;
    const id = req.params.uid;
    const userRecord = await getAuth.getUserByEmail(email);

    if (
      (role && userRecord.customClaims.role === 'admin' && uid === userRecord.uid) ||
      (role && userRecord.customClaims.role === 'user' && uid && id === userRecord.uid)
    ) {
      next();
    } else {
      return res.status(401).send("Access denied");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = {
  isAuthorized,
  isAuthorizedAdmin,
  isAuthorizedAdminandTeacher,
  isAuthorizedAdminandUser
};
