let month = new Date().getMonth(),
  monthArray = ["Jan", "Feb", "Mar", "Apr","May", "June", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"],
  incomeExpenseSelector = document.querySelector("#budgetInput_Selector"),
  descriptionInput = document.querySelector("#description"),
  amountInput = document.querySelector("#amount"),
  allIncomesArray = [],allExpensesArray = [];

monthArray.map((value,index)=>{
  if (month === index) {
    month = value;}
});

document.querySelector("#time").innerHTML =  `${month} / ${new Date().getFullYear()}`;

retrieveIncomesExpensesServerData('/expenses');
retrieveIncomesExpensesServerData('/incomes');

function submitNewIncomeExpenseBtn() {
   let description = descriptionInput.value,
       amount =Number(amountInput.value);
   if (checkPostDataValidation(description,amount)) {
       if (incomeExpenseSelector.value == 'income') {
        postNewIncomeOrExpenseToServer('/incomes',description,amount);
      }else{
        postNewIncomeOrExpenseToServer('/expenses',description,amount);
      }
      deleteErrorMessage();
   }      
   descriptionInput.value = ""; amountInput.value = "";
}

function checkPostDataValidation(desc,amount){
  if (desc !== "" && isNaN(desc) && amount > 0 && amount !== "") {
    return true;}
   errorMessageDisplay();
   return false;
}

function retrieveIncomesExpensesServerData(path){
  document.querySelector('.loader').style.display = 'block';     
  axios.get(path)
  .then((response)=> {
      if (response.status == 200) {         
           let data = response.data,
            url= response.config.url;
          displayIncomesOrExpenses(url,data)
          if (url == '/incomes') {    
            document.querySelector('.loader').style.display = 'none';//?Get incomes is called after expenses there for loader bar stops here
          }            
      }else{
        console.log(`got error ${response.status}`);
      }
  })
  .catch((error)=> {
      errorMessageDisplay()
      console.log(error);
  });
}

function postNewIncomeOrExpenseToServer(path,desc,amount){
let currentDateTime = currentDateAndTime();
axios.post(path,{
  description:desc,
  amount:amount,
  dateAndTime:currentDateTime
})
.then((response)=> {
    if (response.status == 201) {
         let data = response.data, url= response.config.url;
          if (url == '/incomes'){  
            createIncomeExpenseElement(incomesDisplay,data,allIncomesArray)
          }else{
            createIncomeExpenseElement(expensesDisplay,data,allExpensesArray)
          }
          calcOverAllBalanceAndDisplay(allIncomesArray,allExpensesArray)
    }else{
      console.log(`got error ${response.status}`);
    }
})
.catch((error)=> {
  errorMessageDisplay();
    console.log(error);
});
}

function displayIncomesOrExpenses(url,responseArray){
  if (url == '/incomes') {  
    let =  incomesDisplay = document.querySelector(`#incomesDisplay`);  
      responseArray.forEach((val,i) => {
      createIncomeExpenseElement(incomesDisplay,val,allIncomesArray)
  });
}else{
  let = expensesDisplay = document.querySelector(`#expensesDisplay`);  
       responseArray.forEach((val,i) => {
      createIncomeExpenseElement(expensesDisplay,val,allExpensesArray)
  });
}     
     calcOverAllBalanceAndDisplay(allIncomesArray,allExpensesArray);
}

function deleteElementWithIconAndId(path,icon,id){
 let currentDateTime = currentDateAndTime();
  icon.onclick = function(){
    let parent = icon.parentElement;
    axios.delete(`${path}/${id}`,{
      data:{ dateAndTime: currentDateTime} 
      })
    .then(function (response) {
        if (response.status == 200) {
        let  data = response.data;
          parent.remove();
            if (path == '/incomes') {
                deleteSingleValueFromArray(allIncomesArray,data.amount);
                calcSingleExpensePercentageAndDisplay();
              }
            if (path == '/expenses') {
               deleteSingleValueFromArray(allExpensesArray,data.amount); 
              }
               calcOverAllBalanceAndDisplay(allIncomesArray,allExpensesArray);
        }else{
            console.log(`got error ${response.status}`);
        }
    })
    .catch(function (error) {
        console.log(error);
    });
      }
}

function deleteSingleValueFromArray(array,amount){
  return  array.splice(array.indexOf(amount),1);
}

function calcOverAllBalanceAndDisplay(incomes,expenses){
 let currentBudgetDisplay = document.querySelector("#currentBudget"),
 expensesPercentage = document.querySelector(".percentage"),
 incomesTotal = incomes.reduce((total,val)=> total+ val,0),
 expensesTotal = expenses.reduce((total,val)=> total+ val,0);
 calcIncomesExpensesSumBalanceAndDisplay(incomesTotal,expensesTotal);
 calcExpensesPercentage(incomesTotal,expensesTotal,expensesPercentage);
 totalBalance = incomesTotal - expensesTotal;
 return totalBalance > 0 ? currentBudgetDisplay.innerHTML = '+'+totalBalance.toFixed(2):
 currentBudgetDisplay.innerHTML = totalBalance.toFixed(2);
}

function calcIncomesExpensesSumBalanceAndDisplay(incTotal,expTotal){
   document.querySelector("#incomeAmount").innerHTML = '+'+incTotal.toFixed(2); 
   expensesSumDisplay = document.querySelector("#expenseAmount").innerHTML = '-'+expTotal.toFixed(2);
}

function calcExpensesPercentage(income,expense,displayTable){
    let totalBalancePercentage = (expense/income) *100;
    if(totalBalancePercentage == Infinity || isNaN(totalBalancePercentage) || (totalBalancePercentage == undefined)){
      totalBalancePercentage = 0; }
      displayTable.innerText = `${totalBalancePercentage.toFixed(1)}%`;
}

function createIncomeExpenseElement(displayTable,val,array){
  let newElement = document.createElement('p');
  displayTable.appendChild(newElement);  
  //?--Income and Expense elements have different structure
  if(array == allExpensesArray){
  newElement.innerHTML = `<span class="desc">${val.description}</span> 
  <span class="amount">-<span class="singleValue singleExp">${val.amount.toFixed(2)}</span><span class="percentageSolo">0%</span></span>`
  }else{
    newElement.innerHTML = `<span class="desc">${val.description}</span> <span class="amount">
    +<span class="singleValue singleInc">${val.amount.toFixed(2)}</span></span>`}
 
  let deleteIcon = document.createElement('i');
  deleteIcon.classList.add("far");
  deleteIcon.classList.add("fa-times-circle");
  newElement.appendChild(deleteIcon);
  (array == allExpensesArray) ? deleteElementWithIconAndId('/expenses',deleteIcon,val._id):deleteElementWithIconAndId('/incomes',deleteIcon,val._id);
  array.push(val.amount);
  calcSingleExpensePercentageAndDisplay();
  return newElement;
}

function calcSingleExpensePercentageAndDisplay(){
   //! single expense percentage display table if its  1 > calc percentages else don't
   let singlePercentageDisplay = [...document.querySelectorAll(".percentageSolo")];
   if (singlePercentageDisplay.length > 0) {
     let incomesTotal = allIncomesArray.reduce((total,val)=> total+ val,0),
        singleExpenses = [...document.querySelectorAll(".singleValue.singleExp")];
        singleExpenses.forEach((el,i) => {
        calcExpensesPercentage(incomesTotal,el.innerText,singlePercentageDisplay[i]);
     });
   }
}

function currentDateAndTime(){
  let minutes = new Date().getMinutes();
  minutes < 10 ? '0'+minutes.toString() : minutes;
 return 'Date|'+new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+'|Time|'+new Date().getHours()+':'+minutes;
}

function errorMessageDisplay(){
  let errorDisplay = document.querySelector('#errorDisplay');
   errorDisplay.style.cssText = "display:block"
}

function deleteErrorMessage(){
    errorDisplay.style.cssText = "display:none"
   }

incomeExpenseSelector.onclick = () => {
    submitBtnColorControl()
    }
      
descriptionInput.onfocus =()=>{
      descAmountInputFocusHandler(descriptionInput,amountInput);
    } 
amountInput.onfocus = () =>{
      descAmountInputFocusHandler(amountInput,descriptionInput);
    }
    
    function descAmountInputFocusHandler(inputA,inputB){
      let submitBtnIcon = document.querySelector(".far.fa-check-circle");
      if (incomeExpenseSelector.value == "income") {
        inputA.style.cssText = "border:1.5px  solid rgb(57, 177, 175);";
        submitBtnIcon.style.color = 'rgb(57, 177, 175)'
      } else if (incomeExpenseSelector.value == "expenses") {
        inputA.style.cssText = "border:1.5px solid rgb(249, 61, 67);"
        submitBtnIcon.style.color = 'rgb(249, 61, 67)'
      }
        inputB.style.cssText =""; incomeExpenseSelector.style.cssText ="";
    }
    function submitBtnColorControl(){
      let submitBtnIcon = document.querySelector(".far.fa-check-circle");
      if (incomeExpenseSelector.value == "income") {
            incExpSelectorClickHandler(submitBtnIcon,incomeExpenseSelector,"rgb(57, 177, 175)")
      }else if (incomeExpenseSelector.value == "expenses") {
            incExpSelectorClickHandler(submitBtnIcon,incomeExpenseSelector," rgb(249, 61, 67)")
      } amountInput.style.cssText = "";  descriptionInput.style.cssText = ""; 
    }

    function incExpSelectorClickHandler(btn,selector,color){
      btn.style.color = color;
      selector.style.cssText = `border:1.5px  solid ${color};`
    }
    amountInput.onkeypress = (event) =>{
      if(event.keyCode === 13){
        submitNewIncomeExpenseBtn();}
    }
    document.querySelector(".far.fa-check-circle").onmousedown = ()=>{
      document.querySelector(".far.fa-check-circle").style.cssText = "animation: flip .2s infinite linear" ;
       submitBtnColorControl();
    }
    document.querySelector(".far.fa-check-circle").onmouseup = ()=>{
      document.querySelector(".far.fa-check-circle").style.cssText =""
      submitBtnColorControl();
    }