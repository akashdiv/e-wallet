function getTimeZone(){
  return now = new Date().toLocaleTimeString('en-us', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

document.querySelector('#ewallet-form').addEventListener('submit', function(e){
  e.preventDefault();

  const addType = document.querySelector('.add__type').value;
  const addDesc = document.querySelector('.add__description').value;
  const addValue = document.querySelector('.add__value').value;

  if(!addDesc || !addValue) return


  addItem(addType, addDesc, addValue)

  resetFrom();
});

showItems();

function showItems(){
  let items = getData();

  for(let item of items){
    const newHtml = `
    <div class="item">
      <div class="item-description-time">
        <div class="item-description">
          <p>${item.addDesc}</p>
        </div>
        <div class="item-time">
          <p>${item.time}</p>
        </div>
      </div>
      <div class="item-amount ${item.addType === '+' ? 'income-amount' : 'expense-amount'}">
        <p>${item.addType}$${item.addValue}</p>
      </div>
    </div>
  `;
  document.querySelector('.collection').insertAdjacentHTML('afterbegin', newHtml);
  }
}

function addItem(addType, addDesc, addValue){

  const time = getTimeZone();

  const newHtml = `
    <div class="item">
      <div class="item-description-time">
        <div class="item-description">
          <p>${addDesc}</p>
        </div>
        <div class="item-time">
          <p>${time}</p>
        </div>
      </div>
      <div class="item-amount ${addType === '+' ? 'income-amount' : 'expense-amount'}">
        <p>${addType}$${addValue}</p>
      </div>
    </div>
  `;
  document.querySelector('.collection').insertAdjacentHTML('afterbegin', newHtml);

  addItemAPI(addType, addDesc, addValue, time);

  showTotalIncome();

  showTotalExpence();

  showTotalBalance();
}

function getData(){
  let items = localStorage.getItem('items');

  if(items){
    items = JSON.parse(items);
  }else{
    items = [];
  }

  return items;
}

function addItemAPI(addType, addDesc, addValue, time){

  let items = getData();

  items.push({addType, addDesc, addValue, time});
  localStorage.setItem('items', JSON.stringify(items))
}

showTotalIncome();

function showTotalIncome(){
  let items = getData();
  let totalIncome = 0;

  for(let item of items){
    if(item.addType === '+'){
      totalIncome += eval(item.addValue) 
    }
  };

  document.querySelector('.income__amount p').innerText = `$${totalIncome}`;
};

showTotalExpence();

function showTotalExpence(){
  let items = getData();
  let totalExpence = 0;

  for(let item of items){
    if(item.addType === '-'){
      totalExpence += eval(item.addValue) 
    }
  };

  document.querySelector('.expense__amount p').innerText = `$${totalExpence}`;
};

showTotalBalance();

function showTotalBalance(){
  let items = getData();
  let totalBalance = 0;

  for(let item of items){
    if(item.addType === '+'){
      totalBalance += eval(item.addValue) 
    }else{
      totalBalance -= eval(item.addValue) 
    }
  };

  document.querySelector('.balance__amount p').innerText = totalBalance;

  // if(totalBalance >= 0){
  //   document.querySelector('header').className = 'green';
  // }else{
  //   document.querySelector('header').className = 'red';
  // }

  document.querySelector('header').className = (totalBalance >= 0) ? 'green':'red';
};

function resetFrom(){
  document.querySelector('.add__type').value = '+';
  document.querySelector('.add__description').value = '';
  document.querySelector('.add__value').value = '';
}