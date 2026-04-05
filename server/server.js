const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/notes', require('./routes/notes'));

const syncDatabase = (options = { alter: true }) => db.sequelize.sync(options);

if (require.main === module) {
  syncDatabase()
    .then(() => {
      console.log('Database connected and synced!');
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.log('Error connecting to DB:', err));
}

module.exports = { app, syncDatabase };