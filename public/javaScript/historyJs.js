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
 let dateTime =dateAndTimeElegantStructure(obj)
table.innerHTML+= `
                <tr>
                  <td>${obj.operation}</td>
                  <td>${obj.type}</td>
                  <td>${dateTime}</td>
                  <td>${obj.description}</td>
                  <td>${obj.amount}</td>
                </tr>`
}

function dateAndTimeElegantStructure(obj){
  let date = obj.date.split('|'),
  time = date[3].split(':');
  if (time[0].length < 2) {
    time[0] = '0'+time[0]
  }
  if (time[1].length < 2) {
    time[1] = '0'+time[1]
  }
 return `${date[1]} - ${time[0]}:${time[1]}`;
}