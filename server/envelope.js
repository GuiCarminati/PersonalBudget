class Envelope {
    constructor(id,name,budget,startingBalance) {
        this.id = id;
        this.name = name;
        this.budget = budget;
        this.currentBalance = startingBalance;
        this.archived = false;
    }
}

module.exports = Envelope;