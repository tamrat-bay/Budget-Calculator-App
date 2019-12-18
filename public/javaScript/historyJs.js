let inc = document.querySelector('.incomes');
getHistoryHandler('/history');

function getHistoryHandler(path){
let incomeTable = document.querySelector('#incomeTable'),
expenseTable = document.querySelector('#expenseTable');
axios.get(path)
.then((response)=> {
  if (response.status == 200) {
       let data = response.data;
        data.forEach(val => {
            if(val.type == "incomes"){
                displayOnTable(val,incomeTable);
         }
         if(val.type == "expenses"){
              displayOnTable(val,expenseTable)
         }
        });
  }else{
    console.log(`got error ${response.status}`);
  }
})
.catch((error)=> {
  console.log(error);
});
}

function displayOnTable(obj,table){
table.innerHTML+= `
                <tr>
                  <td>${obj.operation}</td>
                  <td>${obj.type}</td>
                  <td>${obj.date}</td>
                  <td>${obj.description}</td>
                  <td>${obj.amount}</td>
                </tr>`
}
