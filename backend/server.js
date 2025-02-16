const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const twilio = require('twilio');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Twilio Setup
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Queue Schema
const QueueSchema = new mongoose.Schema({
    name: String,
    phone: String,
    status: { type: String, default: "waiting" }
});
const Queue = mongoose.model('Queue', QueueSchema);

// Add Customer to Queue
app.post('/queue', async (req, res) => {
    const { name, phone } = req.body;
    const newCustomer = new Queue({ name, phone });
    await newCustomer.save();
    res.json({ message: "Added to queue" });
});

// Get Current Queue
app.get('/queue', async (req, res) => {
    const queue = await Queue.find({ status: "waiting" });
    res.json(queue);
});

// Notify Customer
app.post('/notify', async (req, res) => {
    const { phone, message } = req.body;
    client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
    }).then(() => res.json({ success: true }))
      .catch(err => res.status(500).json({ error: err.message }));
});

// Mark Customer as Served
app.put('/queue/:id', async (req, res) => {
    await Queue.findByIdAndUpdate(req.params.id, { status: "served" });
    res.json({ message: "Customer served" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
