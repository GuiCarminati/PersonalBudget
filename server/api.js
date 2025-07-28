const express = require('express');
// const errorhandler = require('errorhandler');
const db = require('./db');

const apiRouter = express.Router();
module.exports = apiRouter;

apiRouter.get('/',getAllEnvelopes);
apiRouter.param('id',processId);
apiRouter.get('/:id',getEnvelope);
apiRouter.post('/',newEnvelopeInstance,createEnvelope);
apiRouter.put('/:id',newEnvelopeInstance,updateEnvelope);
apiRouter.put('/:id/balance',updateBalance);
apiRouter.put('/:id/archive',archiveEnvelope);
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
    const updated = db.updateEnvelope(req.newInstance);
    if(updated){
        res.status(201).send(updated);
    } else {
        next(createError('Failed to update'));
    }
}

function updateBalance(req,res,next){
    const id = req.found.id;
    const value = req.body.transactionValue;
    try {
        const env = db.updateBalance(id,value);
        res.status(200).send(env);
    } catch (error) {
        next(createError(error.message));
    }
}

function archiveEnvelope(req,res,next){
    const id = req.found.id;
    const archiveBoolean = req.body.archiveBoolean;
    try {
        db.archiveEnvelope(id,archiveBoolean);
        res.status(204).send(`Envelope with id ${id} archived.`)
    } catch (error) {
        next(createError(error.message));
    }
}

function deleteEnvelope(req,res,next){
    const id = req.found.id;
    try {
        db.deleteEnvelope(id);
        res.status(204).send(`Envelope with id ${id} deleted.`)
    } catch (error) {
        next(createError(error.message));
    }
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
    const newValues = req.body;
    let newInstance;
    if(req.method === 'PUT'){ // call constructor func with original ID for PUT requests
        const original = req.found;
        newInstance = db.envelopeConstructor(
            newValues.name || original.name, // if no value given in req.body, keep original values
            newValues.budget || original.budget,
            newValues.balance || original.currentBalance,
            original.id
        );
    } else if(req.method === 'POST'){  // call constructor func without ID for POST requests
        newInstance = db.envelopeConstructor(
            newValues.name,
            newValues.budget,
            newValues.balance
        );
    }
    req.newInstance = newInstance;
    next();
}


// aux functions

function createError(message,code=500) {
    const err = new Error(message);
    err.status = code;
    return err;
}

