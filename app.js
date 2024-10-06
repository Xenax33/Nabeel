const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://anti-rip-system-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();
const collectionName = "Nabeel"; // Replace with your collection name

// 1. API to Add Data
app.post('/add-data', async (req, res) => {
  try {
    const { LicenseKey, ComputerKey } = req.body;

    if (!LicenseKey || !ComputerKey) {
      return res.status(400).json({ error: 'LicenseKey and ComputerKey are required.' });
    }

    const docRef = await db.collection(collectionName).add({ LicenseKey, ComputerKey });
    res.status(200).json({ message: 'Data added successfully', id: docRef.id });
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).json({ error: 'Failed to add data' });
  }
});

// 2. API to Check if Data Exists
app.post('/check-data', async (req, res) => {
  try {
    const { LicenseKey, ComputerKey } = req.body;

    if (!LicenseKey || !ComputerKey) {
      return res.status(400).json({ error: 'LicenseKey and ComputerKey are required.' });
    }

    const querySnapshot = await db.collection(collectionName)
      .where('LicenseKey', '==', LicenseKey)
      .where('ComputerKey', '==', ComputerKey)
      .get();

    if (querySnapshot.empty) {
      res.status(200).json({ exists: false });
    } else {
      res.status(200).json({ exists: true });
    }
  } catch (error) {
    console.error('Error checking data:', error);
    res.status(500).json({ error: 'Failed to check data' });
  }
});

app.get('/get-data', async (req, res) => {
  try {
    const snapshot = await db.collection(collectionName).get();

    if (snapshot.empty) {
      return res.status(200).json({ message: 'No data found' });
    }

    let data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(data);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
