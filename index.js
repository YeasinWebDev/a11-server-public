const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT);

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

app.get("/", (req, res) => {
  res.send("CRUD IS RUNNER");
});

const uri = `mongodb+srv://${username}:${password}@cluster0.be4xnde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("A11");
    // collection for AllCourses
    const AllCoursesCollection = database.collection("AllCourses");
    const bookedCoursesCollection = database.collection("bookedCourses");

    app.get("/courses", async (req, res) => {
      const courses = await AllCoursesCollection.find().toArray();
      res.json(courses);
    });

    app.get("/coursesByEmail", async (req, res) => {
      const email = req.query.email;
      const courses = await AllCoursesCollection.find({
        "provider.email": email,
      }).toArray();
      res.send(courses);
    });

    app.get("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const course = await AllCoursesCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(course);
    });

    app.get("/coursesByName", async (req, res) => {
      const name = req.query.name;
      const course = await AllCoursesCollection.find({
        course_Area: name,
      }).toArray();
      res.json(course);
    });

    app.get("/coursesBySearch", async (req, res) => {
      const name = req.query.name;
      const regex = new RegExp(name, "i");
      console.log(name);
      const courses = await AllCoursesCollection.find({
        Course_name: { $regex: regex },
      }).toArray();
      res.json(courses);
    });

    app.post("/courses", async (req, res) => {
      const newCourse = req.body;
      const result = await AllCoursesCollection.insertOne(newCourse);
      res.json(result);
    });

    app.put("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCourse = req.body;
      const result = await AllCoursesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedCourse },
        { upsert: true }
      );
      res.json(result);
    });

    app.delete("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const result = await AllCoursesCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    // booked_courses requests
    app.post("/booked_courses", async (req, res) => {
      const newCourse = req.body;
      const result = await bookedCoursesCollection.insertOne(newCourse);
      res.json(result);
    });

    app.get("/booked_courses", async (req, res) => {
      const email = req.query.email;
      const booked_courses = await bookedCoursesCollection
        .find({ user_email: email })
        .toArray();
      res.send(booked_courses);
    });

    app.get("/booked_courses/:id", async (req, res) => {
      const id = req.params.id;
      const course = await bookedCoursesCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(course);
    });

    app.patch("/updateStatus", async (req, res) => {
      const name = req.query.name;
      const updatedStatus = req.body.status;
      console.log(name, updatedStatus);
      try {
        const result = await bookedCoursesCollection.updateOne(
          { name: name },
          { $set: { course_Status: updatedStatus } }, 
          { upsert: true }
        );
        res.json(result);
      } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ error: "Failed to update status" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
