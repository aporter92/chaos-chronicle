const Express = require ('express');
const app = Express();
require("dotenv").config()

const dbConnection = require("./db");
const controllers = require("./controllers");
const middleware = require("./middleware")

app.use(Express.json());
app.use("/user", controllers.userController);
app.use(middleware.validateSession)


dbConnection.authenticate()
.then(()=> dbConnection.sync())
.then(()=> {
    app.listen(3000,()=> {
        console.log(`[Server] : App is listening on 3000.`);
    });
})
.catch((err)=> {
    console.log(`[Server]: Server crashed. Error = ${err}`);
});
