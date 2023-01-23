document.querySelector('#ewallet-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // console.log('submitted');

    const type = document.querySelector('.add__type').value;
    const desc = document.querySelector('.add__description').value;
    const value = document.querySelector('.add__value').value;

    if (desc && value) {
        addItems(type, desc, value);
        resetForm();
    }

});
/*******************************/
//  ************* UI *************
/********************************/

/************* Show data from local storage *************/
showItems();

function showItems() {
    let items = getItemsFromLS();


    const collection = document.querySelector('.collection');

    for (let item of items) {
        const newHtml = `
          <div class="item">
            <div class="item-description-time">
              <div class="item-description">
                <p>${item.desc}</p>
              </div>
              <div class="item-time">
                <p>${item.time}</p>
              </div>
            </div>
            <div class="item-amount ${item.type === '+' ? 'income-amount' : 'expense-amount'}">
              <p>${item.type}$${sep(item.value)}</p>
            </div>
          </div>
          `;
        collection.insertAdjacentHTML('afterbegin', newHtml);
    }

} //.Show data from local storage 


function addItems(type, desc, value) {
    const time = getFormattedTime();
    const newHtml = `
                  <div class="item">
                    <div class="item-description-time">
                      <div class="item-description">
                        <p>${desc}</p>
                      </div>
                      <div class="item-time">
                        <p>${time}</p>
                      </div>
                    </div>
                    <div class="item-amount ${type === '+' ? 'income-amount':'expense-amount'}">
                      <p>${type}$${sep(value)}</p>
                    </div>
                  </div>
                  `

    const collection = document.querySelector('.collection');
    collection.insertAdjacentHTML('afterbegin', newHtml);

    addItemsToLS(desc, time, type, value);

    showTotalIncome();
    showTotalExpense();
    showTotalBalance();
}

function resetForm() {
    document.querySelector('.add__type').value = '+';
    document.querySelector('.add__description').value = '';
    document.querySelector('.add__value').value = '';
}
/*******************************/
//   Store data into local storage
/********************************/
function getItemsFromLS() {
    let items = localStorage.getItem('items');
    return (items) ? JSON.parse(items) : [];
}

function addItemsToLS(desc, time, type, value) {

    let items = getItemsFromLS();

    items.push({ desc, time, type, value });

    localStorage.setItem('items', JSON.stringify(items));
}
//*****************************//
//Calculate Total Income & Expense
//*****************************//

showTotalIncome();

function showTotalIncome() {
    let items = getItemsFromLS();

    // let totalIncome = 0;
    // for (let item of items) {
    //     if (item.type === '+') {
    //         totalIncome += parseInt(item.value);
    //     }
    // }
    let totalIncome = items
        .filter((item) => item.type === '+')
        .reduce((income, item) => income + parseInt(item.value), 0);

    document.querySelector('.income__amount p').innerText = `$${sep(totalIncome)}`;
}

showTotalExpense();

function showTotalExpense() {
    let items = getItemsFromLS();

    // let totalExpenses = 0;
    // for (let item of items) {
    //     if (item.type === '-') {
    //         totalExpenses += parseInt(item.value);
    //     }
    // }

    let totalExpenses = items
        .filter((item) => item.type === '-')
        .reduce((expense, item) => expense + parseInt(item.value), 0);

    document.querySelector('.expense__amount p').innerText = `$${sep(totalExpenses)}`
}

showTotalBalance();

function showTotalBalance() {
    const items = getItemsFromLS();
    let balance = 0;

    for (let item of items) {
        if (item.type === '+') {
            balance += parseInt(item.value);
        } else {
            balance -= parseInt(item.value);
        }
    }

    document.querySelector('.balance__amount p').innerText = `${sep(balance)}`;

    document.querySelector('header').className = (balance >= 0) ? 'green' : 'red';
}
//*****************************//
//   Utitlity function
//*****************************//
function getFormattedTime() {
    const now = new Date().toLocaleTimeString('en-us', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
    const date = now.split(',')[0].split(' ');
    const time = now.split(',')[1];
    return `${date[1]} ${date[0]},${time}`;

}

function sep(amount) {
    amount = parseInt(amount);
    return amount.toLocaleString();
}