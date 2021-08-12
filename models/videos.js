const { DataTypes } = require("sequelize");
const db = require("../db");

const Video = db.define("video", {
    title: {
        type: DataTypes.STRING
    },
    link: {
        type: DataTypes.STRING
    }
})

module.exports = Video;