const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sync database
db.sequelize.sync({ alter: true }) // <-- ensures tags & userId columns exist
  .then(() => console.log("Database connected and synced!"))
  .catch(err => console.log("Error connecting to DB:", err));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/notes', require('./routes/notes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));