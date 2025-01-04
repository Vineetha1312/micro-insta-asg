import express, {Application} from "express"
import dotEnv from "dotenv";
import mongoose from "mongoose";
import PostRouter from "./router/userPostRouter";
import userPostRouter from "./router/userPostRouter";

const app:Application = express();

//configure dotEnv
dotEnv.config({path : "./.env"})

const hostName: string | undefined = process.env.HOST_NAME;
const port: number | undefined = Number(process.env.PORT);
const mongoDBURL: string | undefined = process.env.MONGO_DB_LOCAL_URL;

//connect to MongoDB
if(mongoDBURL !== undefined){
    mongoose.connect(mongoDBURL)
        .then(() => {
            console.log(`Connected to MongoDB Successfully`);
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error)
        })

        app.use(express.json({limit : '50mb'})) //FOr JSON data
        app.use(express.urlencoded({limit:'50mb', extended:true}));
}

app.get("/", (request:express.Request, response:express.Response) => {
    response.status(200).send(`<h2>Welcome to Express Js</h2>`)
})

//configure the Routing
app.use("/api", userPostRouter)

if(port !== undefined && hostName !== undefined){
    app.listen(port, hostName, ()=> {
        console.log(`Express Server is Started at http://${hostName}:${port}`)
    }) 
}

