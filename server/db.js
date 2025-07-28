const Envelope = require('./envelope')

const envelopes = [];
let envelopeIdCounter = 0;

function isValid(env){
    if(!env.name || env.budget<0 || env.currentBalance<0){    
        throw Error(`Invalid envelope values`);
    }
    return true;
}

function envelopeConstructor(name,budget,startingBalance,id=null){
    const newId = id || envelopeIdCounter;
    const newEnvelope = new Envelope(newId,name,budget,startingBalance);
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

function updateBalance(id,transactionValue){
    const env = getEnvelopeById(id);

    const newBalance = env.currentBalance + transactionValue;
    if(newBalance < 0) throw Error(`Not enough balance to complete this transaction.`);

    env.currentBalance = newBalance;
    console.log(`${transactionValue} added or removed to Envelope ${env.name}(${env.id}). New balance is ${newBalance}`);
    return env;
}

function updateInstance(newInstance){
    if(isValid(newInstance)){
        const index = getEnvelopeIndexById(newInstance.id);
        envelopes[index] = newInstance;
        return env;
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

module.exports = {
    envelopeConstructor,
    createEnvelope,
    getEnvelopeById,
    getAllEnvelopes,
    getAllArchivedEnvelopes,
    updateBalance,
    updateInstance,
    archiveEnvelope,
    deleteEnvelope
}


// tests
/*
createEnvelope('Groceries',0,450); // id=1
createEnvelope('Leisure',0,150); // id=2
createEnvelope('Holidays Jan',1500,1500); // id=3, temporary envelope

updateBalance(3,-1500); // holidays have passed, balance was used
envelopes[2].archived = true // archive used envelope

// add some transactions to existing envelopes
updateBalance(1,-110);
updateBalance(1,-57);
updateBalance(2,28);

// show updated envelopes
console.log('All envelopes: ');
console.log(getAllEnvelopes());
console.log('Archived: ');
console.log(getAllArchivedEnvelopes());
// */