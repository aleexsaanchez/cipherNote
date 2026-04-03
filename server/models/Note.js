// models/Note.js
module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define("Note", {
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    tags: { type: DataTypes.JSON, defaultValue: [] },
    userId: { type: DataTypes.INTEGER, allowNull: false }
  });
  return Note;
};