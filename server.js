const express = require('express');
const app = express();
const apiRouter = require('./server/api');

module.exports = app;

const PORT = process.env.PORT || 4001;

app.use('/api/envelopes/',apiRouter);

app.listen(PORT,()=>{
    console.log("Server is listening on port "+PORT);
});