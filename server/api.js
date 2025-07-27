const express = require('express');
const errorhandler = require('errorhandler');
const db = require('./db');
const Envelope = require('./envelope')

const apiRouter = express.Router();
module.exports = apiRouter;

apiRouter.get('/',getAllEnvelopes);
apiRouter.param('id',processId);
apiRouter.get('/:id',getEnvelope);
apiRouter.post('/',newEnvelopeInstance,createEnvelope);
apiRouter.put('/:id',newEnvelopeInstance,updateEnvelope);
apiRouter.delete('/:id',deleteEnvelope);

// error handler
apiRouter.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

// apiRouter.use(errorhandler());

// function declarations
function getAllEnvelopes(req,res,next){
    const envelopes = db.getAllEnvelopes();
    res.status(200).send(envelopes);
}

function getEnvelope(req,res,next){
    res.status(200).send(req.found);
}

function createEnvelope(req,res,next){
    const created = db.createEnvelope(req.newInstance);
    if(created){
        res.status(201).send(created);
    } else {
        next(createError('Failed to create'));
    }
}

function updateEnvelope(req,res,next){
    // to do
}

function deleteEnvelope(req,res,next){
    // to do
}

// intermediary functions
function processId(req,res,next,id){
    const found = getEnvelopeById(id);
    if(found){
        req.found = found;
        next();
    } else {
        next(createError(`Envelope with id ${id} could not be found.`,404));
    }
}

function newEnvelopeInstance(req,res,next){
    // to do
    const env = new Envelope();
    next();
}


// aux functions

function createError(message,code=500) {
    const err = new Error(message);
    err.status = code;
    return err;
}

