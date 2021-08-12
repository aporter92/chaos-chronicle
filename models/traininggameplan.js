const { DataTypes } = require("sequelize");
const db = require("../db");

const TrainingGamePlan= db.define("tplan", {

    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    standUpGoals: {
        type: DataTypes.STRING
    },
    top: {
        type: DataTypes.STRING
    },
    bottom: {
        type: DataTypes.STRING
    },
    issues: {
        type: DataTypes.STRING
    },
    owner: {
        type: DataTypes.INTEGER
    }
});

module.exports = TrainingGamePlan;