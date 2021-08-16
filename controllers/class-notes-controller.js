const Express = require('express');
const router = Express.Router();
const { NotesModel } = require("../models");
let validateJWT = require("../middleware/validate-session");

// ! Create A Class Note
router.post("/create", validateJWT, async(req, res)=> {
    const { date, instructor, technique, notes } = req.body.notes;
    const  person = req.user.id;
    const classNote = {
        date, 
        instructor,
        technique,
        notes,
        owner: person
    }
    console.log(person)
    try {
        const newNote = await NotesModel.create(classNote);
        res.status(200).json(newNote);
    } catch (err) {
        res.status(500).json({error: err});
    }
    NotesModel.create(classNote)
});

// ! Get Class Notes
router.get("/", validateJWT, async (req, res)=>{
    let { id } = req.user;
    try {
        const userNotes = await NotesModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(userNotes);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// ! Update Class Notes
router.put("/update/:id", validateJWT, async (req, res)=>{
    const { date, instructor, technique, notes } = req.body.notes;
    const noteId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: noteId,
            owner: userId
        }
    };

    const updatedNote = {
        date: date,
        instructor: instructor,
        technique: technique,
        notes: notes
    };

    try {
        const update = await NotesModel.update(updatedNote, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// ! Delete A Class Note
router.delete("/delete/:id", validateJWT, async (req, res)=> {
    const ownerId  = req.user.id;
    const noteId= req.params.id;

    try {
        const query = {
            where: {
                id: noteId,
                owner: ownerId
            }
        };
        await NotesModel.destroy(query);
        res.status(200).json({message: "Note removed"});
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

module.exports = router;
