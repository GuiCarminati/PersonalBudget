const totalBalanceTable = document.getElementById('balance-table');
const totalBalanceRowContainer = document.getElementById('total-balance-row-container');
const envelopeTableRowsContainer = document.getElementById('envelopes-table-rows');

// totalBalanceRowContainer.innerHTML = '';
// envelopeTableRowsContainer.innerHTML = '';

// // testing values
// const totalBalance = {                   // testing values
//     budget: 2200,
//     used: 1874,
//     balance: 326
// }
// const envelopes = [                     // testing values
//     {   
//         name:'Groceries',
//         budget: 500,
//         used: 289,
//         balance: 211,
//         id: 1
//     },
//     {   
//         name:'Leisure',
//         budget: 200,
//         used: 85,
//         balance: 115,
//         id: 2
//     },
//     {   
//         name:'Rent',
//         budget: 1500,
//         used: 1500,
//         balance: 0,
//         id: 3
//     }
// ]; 

// populateRow(totalBalance, totalBalanceRowContainer);
// populateTable(envelopes, envelopeTableRowsContainer);

function createCell(value,isCurrency=false,className=null,id=null){
    const newCell = document.createElement('td');
    if(className) newCell.className = className;
    if(id) newCell.id = id;
    if(isCurrency){
        value = value.toLocaleString(undefined,{ minimumFractionDigits:2 });
    } 
    newCell.innerHTML = value;
    return newCell;
}

function populateRow(envObj,rowElement){
    const newRow = {};
    const isCurrency=true;
    if(envObj.name){ 
        // if the obj has a 'name' attribute, it's not the 'Total balance'
        newRow.newName = createCell(envObj.name);
    }
    newRow.newBudget = createCell(envObj.budget,isCurrency,'currency');
    newRow.newUsed = createCell(envObj.used,isCurrency,'currency');
    newRow.newBalance = createCell(envObj.balance,isCurrency,'currency');
    if(envObj.id) {
        // if the obj has an 'id' attribute, it's not the 'Total balance' and should have a button
        newRow.newButton = createUpdateEnvelopeButton(envObj.id);
    }
    for(const key in newRow){
        rowElement.appendChild(newRow[key]);
    }
}

function createUpdateEnvelopeButton(id){
    const newButton = document.createElement('button');
    newButton.className = 'envelope-button';
    newButton.id = `env-button${id+1}`;
    newButton.innerHTML = 'Update';
    newButton.addEventListener('click',()=>updateEnvelopeButton(id));
    return newButton;
}

function populateTable(arrayOfValues,tbodyElement){
    arrayOfValues.forEach((rowValues,index) => {       
        const newRow = document.createElement('tr');
        populateRow(rowValues, newRow, true);
        tbodyElement.appendChild(newRow);
    });
}

// load envelope values from server
function getAllEnvelopes(){
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
    });
}

function renderAllBalances(envelopesArray){
    totalBalanceRowContainer.innerHTML = '';
    envelopeTableRowsContainer.innerHTML = '';
    console.log(envelopesArray);
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
            id: env.id
        }
    });
    // populates My Total Balance values
    populateRow(sumOfEnvelopes, totalBalanceRowContainer);
    // populates My Envelopes table
    populateTable(allEnvelopes, envelopeTableRowsContainer);
}

function updateEnvelopeButton(id){
    console.log('update button clicked');
    // to do
}

function addNewEnvelopeButton(){
    console.log('add new button clicked');
    // to do
}

getAllEnvelopes();