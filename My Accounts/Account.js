const startup = document.getElementById("startup");
const startBtn = document.getElementById("start-btn");
const currencySelect = document.getElementById("currency-select");
const appDiv = document.getElementById("app");
const changeCurrencyBtn = document.getElementById("change-currency");

const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const dateInput = document.getElementById("date");

let currencySymbol = localStorage.getItem("currency");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function showPage() {
    if(currencySymbol){
        startup.style.display = "none";
        appDiv.style.display = "block";
        init();
    } else {
        startup.style.display = "flex";
        appDiv.style.display = "none";
    }
}

showPage();

startBtn.addEventListener("click", () => {
    currencySymbol = currencySelect.value;
    localStorage.setItem("currency", currencySymbol);
    showPage();
});

changeCurrencyBtn.addEventListener("click", () => {
    localStorage.removeItem("currency");
    currencySymbol = null;
    showPage();
});

dateInput.value = new Date().toISOString().split("T")[0];

function addTransaction(e){
    e.preventDefault();
    const transaction = {
        id: Math.floor(Math.random()*100000000),
        text: text.value,
        amount: +amount.value,
        date: dateInput.value
    };
    transactions.push(transaction);
    updateLocalStorage();
    init();
    text.value = "";
    amount.value = "";
    dateInput.value = new Date().toISOString().split("T")[0];
}

function addTransactionToDOM(transaction){
    const sign = transaction.amount<0?"-":"+";
    const item = document.createElement("li");
    item.classList.add(transaction.amount<0?"minus":"plus");
    item.innerHTML=`
        <div style="display:flex;flex-direction:column;">
            <span>${transaction.text}</span>
            <small>${transaction.date}</small>
        </div>
        <span>${sign}${Math.abs(transaction.amount)} ${currencySymbol}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>
    `;
    list.appendChild(item);
}

function sortTransactions(){ transactions.sort((a,b)=>new Date(b.date)-new Date(a.date)); }

function updateValues(){
    const amounts = transactions.map(t=>t.amount);
    const total = amounts.reduce((a,b)=>a+b,0).toFixed(2);
    const income = amounts.filter(a=>a>0).reduce((a,b)=>a+b,0).toFixed(2);
    const expense = (amounts.filter(a=>a<0).reduce((a,b)=>a+b,0)*-1).toFixed(2);
    balance.innerText=`${total} ${currencySymbol}`;
    moneyPlus.innerText=`${income} ${currencySymbol}`;
    moneyMinus.innerText=`${expense} ${currencySymbol}`;
}

function removeTransaction(id){
    transactions = transactions.filter(t=>t.id!==id);
    updateLocalStorage();
    init();
}

function updateLocalStorage(){ localStorage.setItem("transactions",JSON.stringify(transactions)); }

function init(){
    list.innerHTML="";
    sortTransactions();
    transactions.forEach(addTransactionToDOM);
    updateValues();
}

form.addEventListener("submit", addTransaction);

if(currencySymbol) init();
