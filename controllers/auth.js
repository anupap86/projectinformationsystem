const admin = require("../db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const getAuth = admin.auth();
const fireStore = admin.firestore();


const login = async (req, res, next) => {
  try {
    const User = { email: req.body.email, password: req.body.password }
    const secretKey = process.env.secretKey; //keyลับ
    const userRecord = await admin.auth().getUserByEmail(User.email);
    bcrypt.compare(User.password, userRecord.customClaims.passwordHash, function (err, result) {
      if (err) {
        console.log('Error comparing passwords:', err);
      } else if (result === true) {
        const token = jwt.sign({ uid: userRecord.uid, email: userRecord.email, displayName: userRecord.displayName, role: userRecord.customClaims.role }, secretKey, { expiresIn: '1h' });
        // Return JWT token to client-side application
        res.status(200).json({ message: token, });

        console.log('Passwords match!');
      } else {
        res.status(400).json('Passwords do not match!');
      }
    });

  } catch (error) {
    // Handle error if authentication fails
    console.log('Error authenticating user:', error);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

};

const register = async (req, res, next) => {
  try {
    const User = { email: req.body.email, password: req.body.password, role: "user" }
    const data = { profile: req.body.profile, education: req.body.education };
    const hashedPassword = await bcrypt.hash(User.password, 10);
    displayNameth = data.profile.thaiFirstName;
    studentID = data.education.stuID

    getAuth
      .createUser({
        email: User.email,
        password: User.password,
        displayName: displayNameth,
        stuID: studentID

      })
      .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        res.status(200).json({ message: 'Successfully created new user:' + userRecord.uid });
        fireStore.collection("Users").doc(userRecord.uid).set(data);
        getAuth.setCustomUserClaims(userRecord.uid, { role: User.role, passwordHash: hashedPassword })
      })
      .catch((error) => {
        console.log('Error creating new user:', error);
        res.status(400).json({ errorInfo: { code: error.code, message: error.message } });
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const user = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    getAuth
      .getUser(uid)
      .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        res.status(200).json({ message: userRecord.toJSON() });
        // console.log(userRecord.customClaims);
      })
      .catch((error) => {
        console.log('Error fetching user data:', error);
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAccount = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    const User = { email: req.body.email, displayName: req.body.displayName, role: req.body.role }
    getAuth
      .updateUser(uid, {
        email: User.email,
        displayName: User.displayName
      })
      .then((userRecord) => {
        const currentClaims = { role: userRecord.customClaims.role || null, passwordHash: userRecord.customClaims.passwordHash || null };
        const newClaims = {
          role: User.role || null,
          passwordHash: null // if hashedPassword is null, set passwordHash to null
        };
        const mergedClaims = Object.assign(
          {},
          currentClaims,
          Object.fromEntries(
            Object.entries(newClaims).map(([k, v]) => [k, v !== null ? v : currentClaims[k]])
          )
        );

        getAuth.setCustomUserClaims(uid, mergedClaims)
        console.log(`Successfully updated for user ${userRecord.email}`);
        res.status(200).json({ message: `Successfully updated for user ${userRecord.email}` });
      })
      .catch((error) => {
        console.log('Error updating user:', error);
      });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const changepassword = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    const User = { currentpassword: req.body.currentpassword, newpassword1: req.body.newpassword1, newpassword2: req.body.newpassword2 }
    const userRecord = await admin.auth().getUser(uid);
    const hashedPassword = await bcrypt.hash(User.newpassword1, 10);

    bcrypt.compare(User.currentpassword, userRecord.customClaims.passwordHash, function (err, result) {
      if (err) {
        console.log('Error comparing passwords:', err);
      } else if (result === true) {
        if (User.newpassword1 == User.newpassword2) {
          getAuth
            .updateUser(uid, {
              email: User.email,
              displayName: User.displayName
            })
            .then((userRecord) => {
              const currentClaims = { role: userRecord.customClaims.role || null, passwordHash: userRecord.customClaims.passwordHash || null };
              const newClaims = {
                role: null,
                passwordHash: hashedPassword // if hashedPassword is null, set passwordHash to null
              };
              const mergedClaims = Object.assign(
                {},
                currentClaims,
                Object.fromEntries(
                  Object.entries(newClaims).map(([k, v]) => [k, v !== null ? v : currentClaims[k]])
                )
              );
              console.log(newClaims);
              getAuth.setCustomUserClaims(uid, mergedClaims)
              res.status(200).json({ message: `Successfully updated for user ${userRecord.email}` });
            })
            .catch((error) => {
              console.log('Error updating user:', error);
            });

        }

        else {
          res.status(400).json('new Passwords do not match!');
        }
      } else {
        res.status(400).json('Wrong CurrentPassword ');
      }
    });

  } catch (error) {
    // Handle error if authentication fails
    console.log('Error authenticating user:', error);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

};

const resetpassword = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    const password = genpassword(10);
    const hashedPassword = await bcrypt.hash(password, 10)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.mail,
        pass: process.env.pass,
      },
    });
    getAuth
      .updateUser(uid, {
        password: password,
      })
      .then((userRecord) => {
        const currentClaims = { role: userRecord.customClaims.role || null, passwordHash: userRecord.customClaims.passwordHash || null };
        const newClaims = {
          role: null,
          passwordHash: hashedPassword // if hashedPassword is null, set passwordHash to null
        };
        const mergedClaims = Object.assign(
          {},
          currentClaims,
          Object.fromEntries(
            Object.entries(newClaims).map(([k, v]) => [k, v !== null ? v : currentClaims[k]])
          )
        );

        getAuth.setCustomUserClaims(uid, mergedClaims)
        res.status(200).json({ message: `Successfully resetpassword for user ${userRecord.email}`, password: `${password}` });

        const mailOptions = {
          from: 'engineerswubase01@gmail.com',
          to: userRecord.email,
          subject: 'Password reset!!!',
          text: `new password:${password}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      })

      .catch((error) => {
        console.log('Error updating user:', error);
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deluser = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    getAuth
      .deleteUser(uid)
      .then(() => {
        fireStore.collection("Users").doc(uid).delete();
        res.status(200).json({ message: "Record deleted successfully" });
      })
      .catch((error) => {
        console.log('Error deleting user:', error);
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const listAllUsers = async (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const userContainsEmail = (user, searchTerm) => {
    const email = user.email?.toLowerCase() || '';
    return email.includes(searchTerm.toLowerCase());
  };
  const arr = [];
  const listAllUsers = (nextPageToken) => {
    // List batch of users, 1000 at a time.
    getAuth
      .listUsers(1000, nextPageToken)
      .then((listUsersResult) => {
        listUsersResult.users.forEach((userRecord) => {
          arr.push(userRecord.toJSON());
        });

        if (listUsersResult.pageToken) {
          // List next batch of users.
          listAllUsers(listUsersResult.pageToken);
        } else {
          // All users have been listed, filter and send the response.
          const filteredUsers = searchTerm ? arr.filter(user => userContainsEmail(user, searchTerm)) : arr;

          res.status(200).json({ message: filteredUsers });
        }
      })
      .catch((error) => {
        console.log('Error listing users:', error);
      });
  };
  // Start listing users from the beginning, 1000 at a time.
  listAllUsers();
}




const logout = async (req, res, next) => {
  res.clearCookie('jwt');

  // Return success response
  res.status(200).json({ message: 'Logout successful' });
}

function genpassword(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

module.exports = {
  login,
  register,
  user,
  updateAccount,
  changepassword,
  resetpassword,
  deluser,
  listAllUsers,
  logout
};