const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.User = require('./User')(sequelize, Sequelize);
db.Note = require('./Note')(sequelize, Sequelize);

// Associations
db.User.hasMany(db.Note, { foreignKey: 'userId' });
db.Note.belongsTo(db.User, { foreignKey: 'userId' });

module.exports = db;