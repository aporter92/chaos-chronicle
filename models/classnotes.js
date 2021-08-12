const { DataTypes } = require("sequelize");
const db = require("../db");

const ClassNotes= db.define("notes", {

    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    instructor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    technique: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner: {
        type: DataTypes.INTEGER
    }
});

module.exports = ClassNotes;