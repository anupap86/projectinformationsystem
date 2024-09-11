const admin = require("../db");
const collect = require("../models/collection");
const fireStore = admin.firestore();
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

// add
// get all
// get
// update
// delete

const addCollection = async (req, res, next) => {
  uid = req.params.uid
  try {
    console.log("Adding Collection");
    const data = req.body;
    await fireStore.collection("Users").doc(uid).set(data, { merge: true });
    res.status(201).json({ message: "Record saved successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllCollection = async (req, res, next) => {
  try {
    console.log("Getting all Users");

    // Get the search term from the query parameters
    const searchTerm = req.query.searchTerm;

    const User = await fireStore.collection("Users");
    const data = await User.get();
    const arr = [];
    if (data.empty) {
      res.status(200).json({ message: "No records found" });
    } else {
      let total = 0;
      data.forEach((item) => {
        const User = new collect(
          item.id,
          item.data().profile,
          item.data().address,
          item.data().education,
          item.data().reward,
          item.data().language_proficiency,
          item.data().scholarship,
          item.data().work_experience,
          item.data().family_information,
          item.data().training_and_development,
          item.data().faculty_activities,

        );

        // Filter the user based on the search term
        if (!searchTerm || userContainsSearchTerm(User, searchTerm)) {
          arr.push(User);
          total = total + 1;
        }
      });

      res.status(200).json({
        listing: arr,
        count: total
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Helper function to check if a user contains a search term
const userContainsSearchTerm = (user, searchTerm) => {
  const firstName = user.profile?.thaiFirstName?.toLowerCase() || '';
  const lastName = user.profile?.thaiLastName?.toLowerCase() || '';
  const major = user.education?.major?.toLowerCase() || '';
  const stuID = user.education?.stuID?.toLowerCase() || '';

  const fullName = firstName + ' ' + lastName;

  return (
    fullName.includes(searchTerm.toLowerCase()) ||
    major.includes(searchTerm.toLowerCase()) ||
    stuID.includes(searchTerm.toLowerCase())
  );
};

const getEmailCollection = async (req, res, next) => {
  try {
    console.log("Getting all Users by Email");

    // Get the search term from the query parameters
    const searchTerm = req.query.searchTerm;

    const User = await fireStore.collection("Users");
    const data = await User.get();
    const arr = [];
    if (data.empty) {
      res.status(200).json({ message: "No records found" });
    } else {
      let total = 0;
      data.forEach((item) => {
        const User = new collect(
          item.id,
          item.data().profile,
          item.data().address,
          item.data().education,
          item.data().reward,
          item.data().language_proficiency,
          item.data().scholarship,
          item.data().work_experience,
          item.data().family_information,
          item.data().training_and_development,
          item.data().faculty_activities,

        );

        // Filter the user based on the search term
        if (!searchTerm || userContainsEmail(User, searchTerm)) {
          arr.push(User);
          total = total + 1;
        }
      });

      res.status(200).json({
        listing: arr,
        count: total
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const userContainsEmail = (user, searchTerm) => {
  const email = user.profile?.email?.toLowerCase() || '';
  return email.includes(searchTerm.toLowerCase());
};


const getCollection = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    console.log("Getting getUser= %s", uid);
    const user = await fireStore.collection("Users").doc(uid);
    const data = await user.get();
    if (!data.exists) {
      res.status(404).json({ message: "Record not found" });
    } else {
      res.status(200).json(data.data());
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCollection = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    console.log("Updating User= %s", uid);
    const data = req.body;
    const user = await fireStore.collection("Users").doc(uid);
    await user.set(data, { merge: true });
    res.status(200).json({ message: "Record updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addsubjecttype = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    const subject = req.params.subject;
    const type = req.params.type;
    const data = req.body;

    adddata = { type: { id: data } };
    const docRef = fireStore.collection("Users").doc(uid);
    docRef.set({
      [subject]: {
        [type]: data

      }
    }, { merge: true }).then(() => {
      res.status(200).json('add successfully');
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const putsubjecttype = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    const subject = req.params.subject;
    const type = req.params.type;
    const id = req.params.id;
    const data = req.body;

    adddata = { type: { id: data } };
    const docRef = fireStore.collection("Users").doc(uid);
    docRef.set({
      [subject]: {
        [type]: {
          [id]: data
        }
      }
    }, { merge: true }).then(() => {
      res.status(200).json('update successfully');
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCollection = async (req, res, next) => {
  try {
    const uid = req.params.id;
    console.log("Deleting User= %s", uid);
    await fireStore.collection("Users").doc(uid).delete();
    res.status(204).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletesubjecttype = async (req, res, next) => {
  try {
    uid = req.params.uid;
    subject = req.params.subject;
    type = req.params.type;
    id = req.params.id;
    const docRef = admin.firestore().collection("Users").doc(uid);
    const field = `${subject}.${type}.${id}`;
    docRef.update({
      [field]: FieldValue.delete()
    }, { merge: true })
      .then(() => {
        res.status(200).json('Document field deleted successfully.');
      })
      .catch((error) => {
        res.status(400).json('Error deleting document field:', error);
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletesubjectid = async (req, res, next) => {
  try {
    uid = req.params.uid;
    subject = req.params.subject;
    id = req.params.id
    const docRef = admin.firestore().collection("Users").doc(uid);
    const field = `${subject}.${id}`;
    docRef.update({
      [field]: FieldValue.delete()
    }, { merge: true })
      .then(() => {
        res.status(200).json('Document field deleted successfully.')
      })
      .catch((error) => {
        res.status(400).json('Error deleteing document field:', error);
      });
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}


module.exports = {
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
};


/////////////////////
    // Remove the 'capital' field from the document
/* const res = await cityRef.update({
   capital: FieldValue.delete()
 });
 // [END firestore_data_delete_field]
 
 console.log('Update: ', res);*/
