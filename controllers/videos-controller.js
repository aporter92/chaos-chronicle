const Express = require('express');
const router = Express.Router();
const { VideosModel } = require("../models");
let validateJWT = require("../middleware/validate-session");

// ! Post A Video
router.post("/upload", validateJWT, async(req, res)=> {
    const { title, link } = req.body.video;
    const  person  = req.user.id;
    const vid = {
        title,
        link,
        owner: person,
    }
    try {
        const newVid = await VideosModel.create(vid);
        res.status(200).json(newVid);
    } catch (err) {
        res.status(500).json({error: err});
    }
    VideosModel.create(vid)
});

// ! Get Videos
router.get("/", validateJWT, async (req, res)=>{
    let { id } = req.user;
    try {
        const userVideos = await VideosModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(userVideos);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});



// ! Delete A Video
router.delete("/delete/:id", validateJWT, async (req, res)=> {
    const ownerId = req.user.id;
    const videoId= req.params.id;

    try {
        const query = {
            where: {
                id: videoId,
                owner: ownerId
            }
        };
        await VideosModel.destroy(query);
        res.status(200).json({message: "Video removed"});
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

module.exports = router;
