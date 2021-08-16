const Express = require('express');
const router = Express.Router();
const { TrainingGamePlanModel } = require("../models");
let validateJWT = require("../middleware/validate-session");

// ! Create A Training Plan
router.post("/create", validateJWT, async(req, res)=> {
    const { date, standUpGoals, top, bottom, issues } = req.body;
    const { id } = req.user.id;
    const trainingPlan = {
        date, 
        standUpGoals,
        top,
        bottom,
        issues,
        owner: id,
    }
    try {
        const newPlan = await TrainingGamePlanModel.create(trainingPlan);
        res.status(200).json(newPlan);
    } catch (err) {
        res.status(500).json({error: err});
    }
    TrainingGamePlanModel.create(trainingPlan)
});

// ! Get Training Plans
router.get("/", validateJWT, async (req, res)=>{
    let { id } = req.user;
    try {
        const trainingPlans = await TrainingGamePlanModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(trainingPlans);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// ! Update A Training Plan
router.put("/update/:id", validateJWT, async (req, res)=>{
    const { date, standUpGoals, top, bottom, issues } = req.body;
    const planId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: planId,
            owner: userId
        }
    };

    const updatedTrainingPlan = {
        date: date, 
        standUpGoals: standUpGoals,
        top: top,
        bottom: bottom,
        issues: issues
    };

    try {
        const update = await TrainingGamePlanModel.update(updatedTrainingPlan, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// ! Delete A Class Note
router.delete("/delete/:id", validateJWT, async (req, res)=> {
    const ownerId = req.user.id;
    const planId= req.params.id;

    try {
        const query = {
            where: {
                id: planId,
                owner: ownerId
            }
        };
        await TrainingGamePlanModel.destroy(query);
        res.status(200).json({message: "Plan removed"});
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

module.exports = router;
