//import express from "express";
const express = require("express")
const app = express();

const port = 3000;
const User = require("./models/user");
app.listen(port, () => {
    console.log("Rest server pornit pe portul 3000");
})

app.get("/", (req, res) => {
    res.json({
        restAPI: "REST API organizare conferinte"
    })
})