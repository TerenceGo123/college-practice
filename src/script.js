function switchMode(mode) {
    document.querySelectorAll('.mode-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.menu-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`${mode}-mode`).classList.add('active');
    event.target.classList.add('active');

    if (mode === 'currency') {
        fetchCurrencyRates();
    }
}


const display = document.getElementById('display');
const preview = document.getElementById('expression-preview');
const historyList = document.getElementById('historyList');

function appendValue(val) {
    display.value += val;
}

function clearDisplay() {
    display.value = '';
    preview.innerText = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        const expression = display.value;
        const result = eval(expression);
        
        preview.innerText = expression + " =";
        display.value = result;
        
        saveToDB(expression, result);
    } catch {
        display.value = 'Ошибка';
        setTimeout(clearDisplay, 1500);
    }
}


function saveToDB(exp, res) {
    let history = JSON.parse(localStorage.getItem('calcDB') || '[]');
    history.unshift({ exp, res, time: new Date().toLocaleTimeString() });
    localStorage.setItem('calcDB', JSON.stringify(history.slice(0, 5))); 
    renderHistory();
}

function clearHistory() {
    localStorage.removeItem('calcDB');
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('calcDB') || '[]');
    historyList.innerHTML = history.map(h => `<li>${h.time}: ${h.exp} = ${h.res}</li>`).join('');
}




let currencyRates = { USD: 1, EUR: 0.92, RUB: 92.5 };


async function fetchCurrencyRates() {
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        if (response.ok) {
            const data = await response.json();
            currencyRates = data.rates;
            console.log('Курсы валют успешно обновлены:', currencyRates);
            convertCurrency(); 
        }
    } catch (error) {
        console.warn('Не удалось загрузить курсы из сети, используются стандартные курсы:', error);
    }
}

// 1. Валюта
function convertCurrency() {
    const amount = parseFloat(document.getElementById('curr-amount').value);
    const from = document.getElementById('curr-from').value;
    const to = document.getElementById('curr-to').value;
    const resultDiv = document.getElementById('curr-result');

    if (isNaN(amount)) { resultDiv.innerText = "0.00"; return; }

    
    const amountInUSD = amount / currencyRates[from];
    const converted = amountInUSD * currencyRates[to];
    resultDiv.innerText = converted.toFixed(2);
}


const weightRates = { kg: 1, g: 0.001, lb: 0.453592 };
function convertWeight() {
    const amount = parseFloat(document.getElementById('weight-amount').value);
    const from = document.getElementById('weight-from').value;
    const to = document.getElementById('weight-to').value;
    const resultDiv = document.getElementById('weight-result');

    if (isNaN(amount)) { resultDiv.innerText = "0.00"; return; }

    const amountInKg = amount * weightRates[from];
    const converted = amountInKg / weightRates[to];
    resultDiv.innerText = converted.toFixed(3);
}


const timeRates = { sec: 1, min: 60, hr: 3600 };
function convertTime() {
    const amount = parseFloat(document.getElementById('time-amount').value);
    const from = document.getElementById('time-from').value;
    const to = document.getElementById('time-to').value;
    const resultDiv = document.getElementById('time-result');

    if (isNaN(amount)) { resultDiv.innerText = "0.00"; return; }

    const amountInSeconds = amount * timeRates[from];
    const converted = amountInSeconds / timeRates[to];
    resultDiv.innerText = converted.toFixed(2);
}


renderHistory();
fetchCurrencyRates();