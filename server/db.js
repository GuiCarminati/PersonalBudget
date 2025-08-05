const Envelope = require('./envelope')
const Transaction = require('./transaction');

const envelopes = [];
const transactions = [];
let envelopeIdCounter = 0;
let transactionIdCounter = 0;

// envelope operations

function isValid(env){
    if(!env.name || env.budget<0 || env.currentBalance<0){    
        throw Error(`Invalid envelope values`);
    }
    return true;
}

function envelopeConstructor(name,budget,id=null){ // id is optional for POST requests
    const newId = id || envelopeIdCounter+1;
    const newEnvelope = new Envelope(newId,name,budget);
    return newEnvelope;
}

function createEnvelope(newEnvelope){
    if(isValid(newEnvelope)){
        envelopes.push(newEnvelope);
        envelopeIdCounter++;
        return newEnvelope;
    }
}

function getAllEnvelopes(){
    return envelopes.filter((el) => !el.archived);;
}

function getAllArchivedEnvelopes(){
    return envelopes.filter((el) => el.archived);;
}

function getEnvelopeById(id){
    const env = envelopes.find((el) => el.id === id);
    if(!env) throw Error(`No envelope found for id ${id}`);

    return env; 
}

function getEnvelopeIndexById(id){
    const index = envelopes.findIndex((el) => el.id === id);
    if(index < 0) throw Error(`No envelope found for id ${id}`);
    return index; 
}

function updateInstance(newInstance){
    if(isValid(newInstance)){
        const index = getEnvelopeIndexById(newInstance.id);
        envelopes[index] = newInstance;
        return envelopes[index];
    }
}

function archiveEnvelope(id,archiveBoolean=true){
    const env = getEnvelopeById(id);
    env.archived = archiveBoolean;
    return env;
}

function deleteEnvelope(id){
    const env = getEnvelopeById(id);
    if(env.currentBalance > 0) throw Error(`Unable to delete. Envelope currently has a balance of ${env.currentBalance}`);
    
    const index = getEnvelopeIndexById(id);
    envelopes.splice(index,1);
    console.log(`Envelope with id ${id} deleted.`);
}


// transactions operations

function getAllTransactions(){
    return transactions;
}

function getTransactionById(id){
    const transaction = transactions.find((t) => t.id === id);
    if(!transaction) throw Error(`No transaction found for id ${id}`);
    return transaction;
}

// transaction value must be greater than 0
// if one of source or destination envelope IDs are not provided, the transaction is considered to be to/from an external source/destination
// budget always updated in the destination envelope (if provided)
// if both source and destination are provided, the source envelope's budget is also transfered to the destination envelope
function validateTransactionInput(transactionValue, sourceEnvelopeID, destinationEnvelopeID) {
    if (sourceEnvelopeID === destinationEnvelopeID) throw Error(`Source and destination envelope IDs cannot be the same.`);
    if (!transactionValue || isNaN(transactionValue)) throw Error(`Transaction value must be a number.`);
    if (transactionValue <= 0) throw Error(`Transaction value must be greater than 0.`);
    if (!sourceEnvelopeID && !destinationEnvelopeID) throw Error(`No valid source and destination envelope IDs provided.`);
}

function updateEnvelopeBalances(transactionValue, sourceEnvelopeID, destinationEnvelopeID) {
    if (sourceEnvelopeID) {
        const source = getEnvelopeById(sourceEnvelopeID);
        const newSourceBalance = source.currentBalance - transactionValue;
        if (newSourceBalance < 0) throw Error(`Not enough balance in source envelope.`);
        source.currentBalance = newSourceBalance;
        if (destinationEnvelopeID) {
            source.budget -= transactionValue;
        }
    }
    if (destinationEnvelopeID) {
        const destination = getEnvelopeById(destinationEnvelopeID);
        const newDestinationBalance = destination.currentBalance + transactionValue;
        destination.currentBalance = newDestinationBalance;
        destination.budget += transactionValue;
    }
}

function createTransactionInstance(transactionValue, sourceEnvelopeID, destinationEnvelopeID) {
    const timestamp = new Date().toISOString();
    return new Transaction(
        ++transactionIdCounter,
        transactionValue,
        sourceEnvelopeID || null,
        destinationEnvelopeID || null,
        timestamp
    );
}

function addTransaction(transactionValue, sourceEnvelopeID, destinationEnvelopeID) {
    validateTransactionInput(transactionValue, sourceEnvelopeID, destinationEnvelopeID);
    updateEnvelopeBalances(transactionValue, sourceEnvelopeID, destinationEnvelopeID);
    const newTransaction = createTransactionInstance(transactionValue, sourceEnvelopeID, destinationEnvelopeID);
    transactions.push(newTransaction);
    console.log(`Transaction added: ${newTransaction.id}, value: ${newTransaction.amount}, source: ${sourceEnvelopeID}, destination: ${destinationEnvelopeID}`);
    return newTransaction;
}


module.exports = {
    envelopeConstructor,
    createEnvelope,
    getEnvelopeById,
    getAllEnvelopes,
    getAllArchivedEnvelopes,
    updateInstance,
    archiveEnvelope,
    deleteEnvelope,
    getAllTransactions,
    getTransactionById,
    addTransaction
}


// tests
// /*
const groceries = envelopeConstructor('Groceries',450);
createEnvelope(groceries); // id=1
const leisure = envelopeConstructor('Leisure',150);
createEnvelope(leisure); // id=2
const holidays = envelopeConstructor('Holidays Jan',1500);
createEnvelope(holidays); // id=3, temporary envelope

// updateBalance(3,-1500); // holidays have passed, balance was used
// envelopes[2].archived = true // archive used envelope

// add some transactions to existing envelopes
// updateBalance(1,-110);
// updateBalance(1,-57);
// updateBalance(2,28);

// show updated envelopes
// console.log('All envelopes: ');
// console.log(getAllEnvelopes());
// console.log('Archived: ');
// console.log(getAllArchivedEnvelopes());
// */