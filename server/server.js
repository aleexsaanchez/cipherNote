const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sync database
db.sequelize.sync()
  .then(() => console.log("Database connected and synced!"))
  .catch(err => console.log("Error connecting to DB:", err));

// Routes
const userRoutes = require('./routes/users');
const noteRoutes = require('./routes/notes');

app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));