import { showError } from "./utils.js";

const addTransactionFormElement = document.getElementById('add-transaction-form');
const sourceDropdownElement = document.getElementById('transaction-source-id');
const destinationDropdownElement = document.getElementById('transaction-destination-id');
const transactionAmountElement = document.getElementById('transaction-amount');
    
enableFormSubmission(false);
loadFormDropdownOptions();

function handleFormSubmission(e){
    e.preventDefault(); // prevents auto page reload when submitting
    console.log('handling form submission');
    
    const amount = Number(transactionAmountElement.value);
    let sourceID = sourceDropdownElement.value;
    let destID = destinationDropdownElement.value;

    sourceID = sourceID==='#' ? null : Number(sourceID);
    destID = destID==='#' ? null : Number(destID);
    
    if(validateResponse(amount,sourceID,destID)){
        const newTransaction = { amount, sourceID, destID };
        
        fetch('/api/envelopes/transactions/add', {
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(newTransaction)
        })
        .then(res => {
            if(res.ok){
                return res.json();
            } else {
                throw new Error(`${res.status}. Check if the envelope has enough balance.`);
            }
        })
        .then(res => window.alert(`Transaction added: value: ${res.amount}, source: ${res.sourceID}, destination: ${res.destID}`))
        .catch(error => showError(error,true));
    }
}

function validateResponse(transactionAmount,sourceID,destinationID){
    const check = (value) => (!value || (typeof value)!='number' || value <= 0);
    
    if(check(transactionAmount)){
        return showError('Invalid amount!',true);
    }

    // null is accepted for the source and destination IDs
    // if not null, then check if the values are correct
    // if one of them is null, the if is skiped
    if(sourceID!==null && check(sourceID)){
        return showError('Invalid source!',true);
    }
    if(destinationID!==null && check(destinationID)){
        return showError('Invalid destination!',true);
    }
    // but if both of them are null, don't continue
    if(destinationID===null && sourceID===null){
        return showError('At least one of the destination or source must be an envelope!',true);
    }
    // also halt if both IDs are the same
    if(destinationID===sourceID){
        return showError('Source and Destination must be different!',true);
    }
    return true;
}

function loadFormDropdownOptions(){
    fetch('/api/envelopes/')
    .then(res => {
        if(res.ok){
            return res.json();
        } else {
            showError(res);
        }
    })
    .then(res => {
        populateFormDropdownOptions(res);
        return res;
    })
    .then(()=>{
        enableFormSubmission(true);
    })
}

function populateFormDropdownOptions(envelopesList){
    // add "External Balance" options to list of possible source/destination
    const extBalance = {id: "#", name: "External Balance"};
    // add in the begining of the array to appear first in the dropdown options
    envelopesList.unshift(extBalance); 
    // add each envelope in the dropdown lists of sources and destinations
    envelopesList.forEach(env => {
        const option = document.createElement('option');
        option.value = env.id;
        option.innerHTML = `[${env.id}] ${env.name}`
        const copy = option.cloneNode(true);
        sourceDropdownElement.appendChild(option);
        destinationDropdownElement.appendChild(copy);
    });
}

// disable form submission before values are loaded in, enables it once it's ready
function enableFormSubmission(boolean){
    if(boolean){
        addTransactionFormElement.addEventListener('submit',handleFormSubmission);
    } 
    addTransactionFormElement.disabled = !boolean;
    const formElements = addTransactionFormElement.childNodes;
    formElements.forEach(element => {
        element.disabled = !boolean;
    });
}