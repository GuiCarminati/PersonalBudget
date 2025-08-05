class Transaction {
    constructor(id, amount, sourceID, destinationID, timestamp) {
        this.id = id; 
        this.amount = amount;
        this.sourceID = sourceID;
        this.destinationID = destinationID;
        this.timestamp = timestamp || new Date().toISOString();
    }
}


module.exports = Transaction;