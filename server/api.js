const express = require('express');
const errorhandler = require('errorhandler');
const db = require('./db');

const apiRouter = express.Router();
module.exports = apiRouter;

// transaction operations
apiRouter.get('/transactions',getAllTransactions);
apiRouter.get('/transactions/:transactionId',getTransaction);
apiRouter.post('/transactions/add',addTransaction);
// envelope operations
apiRouter.get('/',getAllEnvelopes);
apiRouter.get('/archived',getArchivedEnvelopes);
apiRouter.param('id',processId);
apiRouter.get('/:id',getEnvelope);
apiRouter.post('/',newEnvelopeInstance,createEnvelope);
apiRouter.put('/:id',newEnvelopeInstance,updateEnvelope);
apiRouter.put('/:id/archive',archiveEnvelope);
apiRouter.delete('/:id',deleteEnvelope);

// error handler
// apiRouter.use((err, req, res, next) => {
//   res.status(err.status || 500).json({ message: err.message });
// });

apiRouter.use(errorhandler());

// function declarations
function getAllEnvelopes(req,res,next){
    const envelopes = db.getAllEnvelopes();
    res.status(200).send(envelopes);
}

function getArchivedEnvelopes(req,res,next){
    const envelopes = db.getAllArchivedEnvelopes();
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
    const updated = db.updateInstance(req.newInstance);
    if(updated){
        res.status(201).send(updated);
    } else {
        next(createError('Failed to update'));
    }
}

function archiveEnvelope(req,res,next){
    const id = req.found.id;
    const archiveBoolean = !(req.found.archived); // flips current archived state    
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


// transaction functions

function getAllTransactions(req,res,next){
    const transactions = db.getAllTransactions();
    res.status(200).send(transactions);
}

function getTransaction(req,res,next){
    try {
        const id = Number(req.params.transactionId);
        const transaction = db.getTransactionById(id);
        res.status(200).send(transaction);
    } catch (error) {
        next(createError(error.message));
    }
}

/**
 * Adds a transaction.
 * @param {Object} req.body - The request body. expected request body: {amount, sourceID, destID}
 * @param {number} req.body.amount - Amount to transfer (must be greater than 0).
 * @param {number} [req.body.sourceID] - Source envelope ID (optional).
 * @param {number} [req.body.destID] - Destination envelope ID (optional).
 * If one of sourceID or destID is not provided, the transaction is considered to be to/from an external source/destination.
 * If both are not provided, an error is thrown.
 * @returns {Object} The created transaction object.
 */
function addTransaction(req,res,next){
    const reqBody = req.body;
    const sourceID = reqBody.sourceID ? Number(reqBody.sourceID) : null;
    const destID = reqBody.destID ? Number(reqBody.destID) : null;
    const amount = Number(reqBody.amount);
    try {
        const transaction = db.addTransaction(amount, sourceID, destID);
        res.status(201).send(transaction);
    } catch (error) {
        next(createError(error.message));
    }
}

// intermediary functions
function processId(req,res,next,id){
    const found = db.getEnvelopeById(Number(id));
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
            original.id
        );
    } else if(req.method === 'POST'){  // call constructor func without ID for POST requests
        newInstance = db.envelopeConstructor(
            newValues.name,
            newValues.budget
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

