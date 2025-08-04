import { populateRow, showError } from "./utils.js";

const envelopeNameInputElement = document.getElementById('edit-actions-new-name-text');
const transactionAmountElement = document.getElementById('edit-actions-transaction-amount');
const updateNameButtonElement = document.getElementById('edit-actions-new-name-update-button');
const updateBalanceButtonElement = document.getElementById('edit-actions-update-balance-button');
const archiveButtonElement = document.getElementById('archive-envelope-button');
const deleteButtonElement = document.getElementById('delete-envelope-button');
const envelopeSummaryRowContainer = document.getElementById('edit-balance-summary-row-container');

let envelopeValues;

loadEnvelopeValues();

// CRUD requests
function loadEnvelopeValues(){
    // get envelope ID from URL params
    const params = new URLSearchParams(document.location.search);
    if(!params.has('id')) return showError('invalid ID',true);
    const id = Number(params.get('id'));
    // fetch envelope values from server
    fetch(`api/envelopes/${id}`, {method:'GET'})
    .then(resp => {
        if(resp.ok){
            return resp.json();
        } else {
            console.log(resp);     
        }
    })
    .then(resp => {
        envelopeValues = {
            name: resp.name,
            budget: resp.budget,
            used: resp.budget - resp.currentBalance,
            balance: resp.currentBalance,
            archived: resp.archived
        }    
        populateRow(envelopeValues,envelopeSummaryRowContainer);
        return resp;
    })
    .then(() => loadButtonListeners(id))
    .catch((error) => console.log(error));
}

function updateEnvelopeName(id){
    const newName = envelopeNameInputElement.value;
    if(!newName) return showError('invalid name',true);
    httpRequest(`/api/envelopes/${id}`,'name',{name: newName})
}

function updateEnvelopeBalance(id){
    const transactionValue = Number(transactionAmountElement.value);
    if(!transactionValue || transactionValue <= 0) return showError('invalid amount',true);
    httpRequest(`/api/envelopes/${id}/balance`,'balance',{transactionValue: -transactionValue})
}

function deleteEnvelope(id){
    if(envelopeValues.balance > 0) {
        return showError(`Unable to delete. Envelope currently has a balance of €${envelopeValues.balance}`,true);
    }
    httpRequest(`/api/envelopes/${id}`,'delete',{});
}

function archiveEnvelope(id){
    httpRequest(`/api/envelopes/${id}/archive`,'archive',{})
    .then(()=>{
        envelopeValues.archived = !envelopeValues.archived;
        const archivedState=refreshArchiveButtonState();    
        console.log(`Envelope has been ${archivedState}`);
        window.alert(`Envelope has been ${archivedState}`);        
    })
}

async function httpRequest(path,type,bodyObj){
    let method;
    switch(type){
        case 'archive': method='PUT'; break;
        case 'balance': method='PUT'; break;
        case 'name': method='PUT'; break;
        case 'delete': method='DELETE'; break;
        default: return showError('invalid request');
    }
    fetch(path,{
    method: method,
    headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
    },
    body: JSON.stringify(bodyObj)
    })
    .then(res => {        
        if(res.status===204) return res;
        else return res.json();
    })
    .then(res => {
        console.log(res);
        if(type==='balance' || type==='name'){
            console.log(res);
            refreshEnvelopeValues(res);
        } else if (type==='delete') {
            console.log(`Envelope has been deleted`);
            window.alert(`Envelope has been deleted`);
            envelopeSummaryRowContainer.innerHTML='';
        }
        return res;
    })
    .catch(error => showError(error,true));
}

// helper functions
function loadButtonListeners(id){
    updateNameButtonElement.addEventListener('click',()=>updateEnvelopeName(id));
    updateBalanceButtonElement.addEventListener('click',()=>updateEnvelopeBalance(id));
    archiveButtonElement.addEventListener('click',()=>archiveEnvelope(id));
    deleteButtonElement.addEventListener('click',()=>deleteEnvelope(id));
    refreshArchiveButtonState();
}

function refreshArchiveButtonState(){
    const currentState = envelopeValues.archived ? 'Archived' : 'Unarchived';
    const newButtonState = envelopeValues.archived ? 'Unarchive' : 'Archive';
    archiveButtonElement.innerHTML = newButtonState;
    return currentState;
}

function refreshEnvelopeValues(newValues){
    if(!newValues) return;

    envelopeValues = {
        name: newValues.name,
        budget: newValues.budget,
        used: newValues.budget - newValues.currentBalance,
        balance: newValues.currentBalance
    }
    populateRow(envelopeValues,envelopeSummaryRowContainer);
}
