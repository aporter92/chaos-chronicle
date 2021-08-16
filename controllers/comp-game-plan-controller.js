const Express = require('express');
const router = Express.Router();
const { CompetitionGamePlanModel } = require("../models");
let validateJWT = require("../middleware/validate-session");

// ! Create A Comp Plan
router.post("/create", validateJWT, async(req, res)=> {
    const { date, overridingGoal, standUpGoals, whereDoYouLand, whatNext, issues  } = req.body;
    const { id } = req.user.id;
    const compPlan = {
        date, 
        overridingGoal,
        standUpGoals,
        whereDoYouLand,
        whatNext,
        issues,
        owner: id,
    }
    console.log(req.user.id)
    try {
        const newPlan = await CompetitionGamePlanModel.create(compPlan);
        res.status(200).json(newPlan);
    } catch (err) {
        res.status(500).json({error: err});
    }
    CompetitionGamePlanModel.create(compPlan)
});

// ! Get Comp Plan
router.get("/", validateJWT, async (req, res)=>{
    let { id } = req.user;
    try {
        const compPlans = await CompetitionGamePlanModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(compPlans);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// ! Update A Comp Plan
router.put("/update/:id", validateJWT, async (req, res)=>{
    const { date, overridingGoal, standUpGoals, whereDoYouLand, whatNext, issues } = req.body;
    const planId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: planId,
            owner: userId
        }
    };

    const updatedCompPlan = {
        date: date, 
        overridingGoal: overridingGoal,
        standUpGoals: standUpGoals,
        whereDoYouLand: whereDoYouLand,
        whatNext: whatNext,
        issues: issues
    };

    try {
        const update = await CompetitionGamePlanModel.update(updatedCompPlan, query);
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
        await CompetitionGamePlanModel.destroy(query);
        res.status(200).json({message: "Plan removed"});
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

module.exports = router;
