const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res, next) => {
    res.send({ message: "Root Page" })
})

app.use((req, res, next) => {
    res.status(404).send("Page does not exist")
})

app.listen(port, () => {
    console.log("Server has been started!")
})