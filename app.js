const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "anti-rip-system",
    "private_key_id": "a6d5dcd773ecc3f7a3524ebd9c3e80b28cd52846",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDHLEXq5khsnoVH\nZaSjxkqGYjg0rZLPd8W7sjeHtUYazvJVlyD/PEg8j6riYZ+/gxuPnOEyOVDVjHQe\n5cWc440Qcv9OoTncYuqhxoK7zoiCEwSD3gG2SNsp1ggINsycTO49QTrdYTXhtRYD\nja3qHv9FcLpsIpNYioATOI8+z782cxgXTooNXOE8HHBBQnajeu/wpejoWnh7teTN\ngSzlg7efcM0Oby/ssdR1E56He4Lq5j9WYMA4Mp6iEdPp2tVHXQwgljcbFwCv84qE\n0/C8m5Pw8H1/ElwP6L2F4HFh7VxGmd6qZE+j9PB83NmciKt4WWCwc3YT1MBzvgGS\nc1eYdavpAgMBAAECggEAIj8r13/YuKqKLrRcupdkJZa6ZN5qlbdZvdQfRbum7gGi\n/BIUJ6bxIc6vOqVAH2E3CjrWovjlfA6eQdjO4ZLj5M3tNdM1nH46q23zeUECSmFk\nP5tbDoGZA6jMcUMg7AgzV7+BVGL8bY6iViKUoqLJUGKZf3HzhYAtFQD+6nU0wvL5\n3MkjD1zHuNILEqpqfMTyDaEP5VycK58bs3J+cWjR5Yqhh8sn+e6csYTw53h8ob8v\nljsbzv9KCPoJbloAToacYiO0cE9urA6q6GGZO7sK02t/L+FchSRz2IbxylR63was\nE28+of8NAHPtHxlBhJrKRKOlBS3415F0XSU9Vm6ULQKBgQD28bOUI/4wWRPigC8J\n/LjSVToQ3A3W9ODjFUvM3GsFy1jqVfD7qCSFfb0fa7fQJ7mYhNkVT2tTJbf3RVgO\nJSWWdofrwJoQkUtgWM7io9CghwFmvG8798Muc+obrcsx668AV/M0aTGLSjiBctgu\nOyw9r6Dwyi7DUKcpgrN+khMzHQKBgQDOehkdjdI7Mg/vCESH6gKExx8uuTQctrtO\nQRQC0kRbVYJ7KHnBuSGp206O9L/RIXIUp5yCnINSosJjWYbnOMb1PzCXMjZmYfNJ\nic3Nk6ksjLaMPfErKGKCvZfvgHqIX0c8fATvPhwlz0g3foaW5tp7NkGfo3aFC3TC\nrpECixYWPQKBgDCyoXNJVcs7BczY8m3JxLjVzcmdW61URTUC8hvIK+LMoxAzOn6m\nPe2FSlJz75/A9by6FgU50DRpb8n3htHjSXJOladMKBW0UWUCnmnbXD0L4p7b8iOl\nTHxQp44ly7hgffZXYcKoK/kH/fSpLTCQwry3ccmKVYZ21UA+Yh9HtzmRAoGAAoBk\nMYF4XJM8si6tdeAV67nl3NENmpN0LXyIW4hkn56nmApjfz9Y8w/fIchBUq1PDoUB\nVmvDA4tJQ57gDYkYj/wWAJ7xHchuBCQRRD5XvFxwEb7mXxl8KA1X++TYlzJgUJFI\nFgXwnVyniVSVGNrvJrL/lImMdAwxe/JVe2xn9hkCgYAQwr103bFswXHBYgtIP65E\nCLR7NT3oAC0OE+5LTMLr+C7iIiXwC7bt1iWMcywepVOiRdLQU/ihbGKpIymgcki0\nBIVuW2U0/jPRwhKJoXR6xt5wS5fIEghKt6stciQCIyu2MK/LGHw1ziEKyHlfh9nA\nMJu27hDM/btgTipx1F7gmw==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-oi0nd@anti-rip-system.iam.gserviceaccount.com",
    "client_id": "103766701723646843281",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-oi0nd%40anti-rip-system.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}),
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
