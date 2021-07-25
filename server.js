function formatDate() {
    const now = new Date()

    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let day = now.getDate()
    // 07-22
    return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`
}

const express = require("express")
const app = express()
const cors = require("cors")
const mongoClient = require("mongodb").MongoClient


const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const url = "mongodb://localhost:27017/mydb"

app.use(express.urlencoded({extended: true}));


app.use(cors({
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200
}))
app.use(express.urlencoded({extended: true}));


const serveStatic = require('serve-static');

app.use(serveStatic(__dirname + "/dist"));


app.get("/api/select_health_data",
    async (req, res) => {
        let client
        try {
            client = await mongoClient.connect(url, option)
            const db = client.db("health")
            const collection = db.collection("weight")
            const result = await collection.find().toArray()
            res.json({error: false, result: result})
        } catch (e) {
            res.json({error: true})
        } finally {
            await client.close()
        }
    })

app.post("/api/insert_health_data",
    async (req, res) => {
        let client
        try {
            const weight = req.body.weight
            let date = !req.body.date ? formatDate() : req.body.date;

            console.log(req.body)
            client = await mongoClient.connect(url, option)

           if(!weight){
               res.json({error:true})
               return
           }

            const db = client.db("health")
            const collection = db.collection("weight")
            const count_check = await collection.countDocuments({date: date})
            if (count_check) {
                const where = {date: date}
                const set = {$set: {weight: weight}}
                await collection.updateMany(where, set)
            } else {
                await collection.insertOne({weight: weight, date: date})
            }
            res.json({error: false})
        } catch (e) {
            console.log(e)
            res.json({error: true})
        } finally {
            await client.close()
        }
    })

app.listen(3000)

