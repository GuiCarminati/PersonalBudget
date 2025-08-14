import { addNewTransactionButton, showError, createCell } from "./utils.js";

// Add Transaction button
const addTransactionBtnElement = document.getElementById('add-transaction-button');
const transactionsListElement = document.getElementById('transaction-table-list');

addTransactionBtnElement.addEventListener('click',addNewTransactionButton);

let envelopes = [];

loadEnvelopesList();

function populateTransactionsTable(transactionsList){
    const getEnvelopeById = (id) => envelopes.find(el => el.id === id);
    transactionsListElement.innerHTML = '';
    transactionsList.forEach(element => {
        const newRow = document.createElement('tr');
        const amount = element.amount;
        const timestamp = element.timestamp;
        const sourceID = element.sourceID;
        const destID = element.destinationID;
        const sourceName = sourceID ? getEnvelopeById(sourceID).name : 'External Balance';
        const destName = destID ? getEnvelopeById(destID).name : 'External Balance';        
        
        const value = {};
        value.timestamp = createCell(timestamp);
        value.source = createCell(`[${sourceID || '#'}] ${sourceName}`);
        value.dest = createCell(`[${destID || '#'}] ${destName}`);
        value.amount = createCell(amount,true,'currency');

        for(const key in value){
            newRow.appendChild(value[key])
        }
        transactionsListElement.appendChild(newRow);
    });

}

function loadTransactionsList(){
    fetch('/api/envelopes/transactions')
    .then(res => {
        if(res.ok){
            return res.json();
        } else {
            showError('Internal Server error');
            showError(res);
        }
    })
    .then(res => {
        populateTransactionsTable(res);
    })
    .catch(err=>showError(err.message));
}

function loadEnvelopesList(){
    fetch('/api/envelopes/')
    .then(res => {
        if(res.ok){
            return res.json();
        } else {
            showError(res);
        }
    })
    .then(res => {
        envelopes = res;
        loadTransactionsList();
    })
}


