
function addNewTransactionButton(){
    console.log('add new transaction clicked');
    window.location.href = './addTransaction.html';
}

function populateRow(envObj,rowElement){
    rowElement.innerHTML='';
    if(!envObj) return;
    const newRow = {};
    const isCurrency=true;
    if(envObj.name){ 
        // if the obj has a 'name' attribute, it's not the 'Total balance'
        newRow.newName = createCell(envObj.name);
    }
    newRow.newBudget = createCell(envObj.budget,isCurrency,'currency');
    newRow.newUsed = createCell(envObj.used,isCurrency,'currency');
    newRow.newBalance = createCell(envObj.balance,isCurrency,'currency');
    if(envObj.hasButton && envObj.id){
        newRow.newButton = createUpdateEnvelopeButton(envObj.id);
    }
    for(const key in newRow){
        rowElement.appendChild(newRow[key]);
    }
}

function createUpdateEnvelopeButton(id){
    const newButton = document.createElement('button');
    newButton.className = 'envelope-update-button';
    newButton.id = `env-button-${id}`;
    newButton.innerHTML = 'Update';
    // newButton.addEventListener('click',()=>updateEnvelopeButton(id));
    return newButton;
}


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


function showError(message,windowAlert=false,consoleLog=true){
    if(consoleLog) console.log(message);
    if(windowAlert) window.alert(message);
}


export {
    createCell, 
    populateRow,
    showError, 
    addNewTransactionButton
}