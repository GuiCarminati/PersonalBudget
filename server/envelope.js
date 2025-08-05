class Envelope {
    constructor(id,name,budget) {
        this.id = id;
        this.name = name;
        this.budget = budget;
        this.currentBalance = budget;
        this.archived = false;
    }
}

module.exports = Envelope;