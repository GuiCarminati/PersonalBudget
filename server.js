const express = require('express');
const app = express();

module.exports = app;

const PORT = process.env.PORT || 4001;

app.get((req,res,next)=>{
    res.status(200).send('Hello, World!')
});

app.use(express.static('public'));

app.listen(PORT,()=>{
    console.log("Server is listening on port "+PORT);
});