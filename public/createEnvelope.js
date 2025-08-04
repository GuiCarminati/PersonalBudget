import { showError } from "./utils.js";

const newEnvelopeFormElement = document.getElementById('new-envelope-form');

newEnvelopeFormElement.addEventListener('submit',handleFormSubmission);

function handleFormSubmission(e){
    e.preventDefault(); // prevents auto page reload when submitting
    console.log('handling form submission');
    
    const envelopeName = document.getElementById('new-envelope-name').value;
    const envelopeBudget = document.getElementById('new-envelope-budget').value;
    
    if(!envelopeName) return showError('Invalid Envelope Name!',true);

    if(!envelopeBudget || envelopeBudget <= 0) {
        return showError('Invalid Envelope Budget!',true);
    }
    const newEnvelope = {
        name: envelopeName,
        budget: Number(envelopeBudget),
        balance: Number(envelopeBudget)
    };

    fetch('/api/envelopes', {
        method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(newEnvelope)
    })
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(error => showError(error,true));
}
