import { populateRow } from './utils.js';

const totalBalanceRowContainer = document.getElementById('total-balance-row-container');
const envelopeTableRowsContainer = document.getElementById('envelopes-table-rows');

// testingValues();

populateDashboard();

function populateTable(arrayOfValues,tbodyElement){
    arrayOfValues.forEach((rowValues,index) => {       
        const newRow = document.createElement('tr');
        populateRow(rowValues, newRow, true);
        tbodyElement.appendChild(newRow);
    });
}

// load envelope values from server
function populateDashboard(){
    // get all envelopes from server
    fetch('/api/envelopes/')
    .then(response => {
        if(response.ok){
            return response.json();
        } else {
            console.log(response);
        }
    })
    .then(response => {
        renderAllBalances(response);
        return response;
    })
    .then(() => {
        loadButtonListeners();
    });
}

function renderAllBalances(envelopesArray){
    totalBalanceRowContainer.innerHTML = '';
    envelopeTableRowsContainer.innerHTML = '';
    // console.log(envelopesArray);
    const sumOfEnvelopes = {
        budget: 0,
        used: 0,
        balance: 0
    };
    const allEnvelopes = envelopesArray.map((env) => {
        const used = env.budget - env.currentBalance;
        sumOfEnvelopes.budget += env.budget;
        sumOfEnvelopes.used += used;
        sumOfEnvelopes.balance += env.currentBalance;
        return {
            name: env.name, 
            budget: env.budget, 
            used: used, 
            balance: env.currentBalance, 
            id: env.id,
            hasButton: true
        }
    });
    // populates My Total Balance values
    populateRow(sumOfEnvelopes, totalBalanceRowContainer);
    // populates My Envelopes table
    populateTable(allEnvelopes, envelopeTableRowsContainer);
}

function updateEnvelopeButton(id){
    console.log('update button clicked');
    console.log(id);    
    window.location.href = `./updateEnvelope.html?id=${id}`;
}

function addNewEnvelopeButton(){
    console.log('add new button clicked');
    window.location.href = './createEnvelope.html';
}

function loadButtonListeners(){
    // Add New Envelope button
    const newEnvelopeBtnElement = document.getElementById('new-envelope-button');
    newEnvelopeBtnElement.addEventListener('click',addNewEnvelopeButton);
    // Update Envelope buttons
    const updateEnvelopeHTMLCollection = document.getElementsByClassName('envelope-update-button');
    const envelopeButtonsArray = Array.from(updateEnvelopeHTMLCollection);
    envelopeButtonsArray.forEach(updateEnvButton => {
        const regex = new RegExp(/button-([0-9]+)/); // expected button id format: env-button-1, env-button-2
        const id = updateEnvButton.id.match(regex)[1]; // index 1 is the matching pattern for the ID
        updateEnvButton.addEventListener('click',()=>updateEnvelopeButton(id));
    });
}


// testing function
function testingValues(){
    totalBalanceRowContainer.innerHTML = '';
    envelopeTableRowsContainer.innerHTML = '';

    // testing values
    const totalBalance = {                   // testing values
        budget: 2200,
        used: 1874,
        balance: 326
    }
    const envelopes = [                     // testing values
        {   
            name:'Groceries',
            budget: 500,
            used: 289,
            balance: 211,
            id: 1
        },
        {   
            name:'Leisure',
            budget: 200,
            used: 85,
            balance: 115,
            id: 2
        },
        {   
            name:'Rent',
            budget: 1500,
            used: 1500,
            balance: 0,
            id: 3
        }
    ]; 

    populateRow(totalBalance, totalBalanceRowContainer);
    populateTable(envelopes, envelopeTableRowsContainer);
}