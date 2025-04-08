const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./Routes/authRoutes');
// const UploadRoutes = require('./Routes/UploadRoutes');
dotenv.config();

const path = require('path');




const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
// Increase request body size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use('/user/', authRoutes);
app.use('/notes/', require('./Routes/NotesRoutes'));
// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.DB_URI, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});