const totalBalanceTable = document.getElementById('balance-table');
const totalBalanceRowContainer = document.getElementById('total-balance-row-container');
const envelopeTableRowsContainer = document.getElementById('envelopes-table-rows');

totalBalanceRowContainer.innerHTML = '';
envelopeTableRowsContainer.innerHTML = '';

// testing values
const totalBalance = [2200, 1874, 326]; // testing values
const envelopes = [                     // testing values
    ['Groceries',500,289,211,1],
    ['Leisure',200,85,115,2],
    ['Rent',1500,1500,0,3]
]; 
populateRow(totalBalance, totalBalanceRowContainer);

populateTable(envelopes,envelopeTableRowsContainer);

function populateRow(arrayOfValues,rowElement,withButton=false){
    arrayOfValues.forEach((value, index) => {
        const newCell = document.createElement('td');
        if(typeof value === 'number'){
            if(withButton && index===arrayOfValues.length-1){
                createUpdateEnvelopeButton(value,rowElement);
            } else {
                newCell.className = 'currency'; 
                value = value.toLocaleString(undefined,{ minimumFractionDigits:2 });
                newCell.innerHTML = value;
            }
        } else {
            newCell.innerHTML = value;
        }
        rowElement.appendChild(newCell);
    });
}

function createUpdateEnvelopeButton(id,rowElement){
    const newButton = document.createElement('button');
    newButton.className = 'envelope-button';
    newButton.id = `env-button${id+1}`;
    newButton.innerHTML = 'Update';
    newButton.addEventListener('click',()=>updateEnvelopeButton(id));
    rowElement.appendChild(newButton);
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

function renderAllBalances(){
    // to do
}

function updateEnvelopeButton(id){
    // to do
}