let incomes =[],
     expenses = [];
    function getStatisticsHandler(){
    getHistoryHandler('/history');
    }

    function getHistoryHandler(path){
        incomes =[];
        expenses = [];
    let endDate = document.querySelector('#end'),
    startDate = document.querySelector('#start'),
   
    table = document.querySelector('table');
  axios.get(path)
  .then((response)=> {
      // handle success
      if (response.status == 200) {
           let data = response.data,
            url= response.config.url; 
            console.log(data);
                     table.innerHTML = `<tr>
                          <th>Operation</th>
                          <th>Type</th>
                          <th>Date</th>
                          <th>Description</th>
                          <th>Amount</th>
                        </tr>`
                
            data.forEach(val => {
                if (endDateValidation(endDate.value,val.date,'end') && endDateValidation(start.value,val.date,'start')) {                    
                    console.log('dates match');
                    if (val.type == 'incomes') {
                        incomes.push(val); }

                    if (val.type == 'expenses') {
                        expenses.push(val)
                    }
              
                   displayOnTable(val,table);
                }  

             });
             calcChosenDatesBalance(incomes,expenses,startDate.value,endDate.value)
             if(endDate.value.length !== 16 || start.value.length!== 16){
                errorMessageDisplay()
               }             
      }else{
        console.log(`got error ${response.status}`);
      }
  })
  .catch((error)=> {
    errorMessageDisplay()
      // handle error
      console.log(error);
  });
}

function endDateValidation(startOrDndDate,listDates,type){
    let endDateAndTime = startOrDndDate.split('T'),
        startOrEndDate = endDateAndTime[0].split('-'),
        startOrEnd = endDateAndTime[1].split(':'),
        dateAndTimeFromList = listDates.split('|'),
        dateFromList = dateAndTimeFromList[1].split('-'),
        timeFromList = dateAndTimeFromList[3].split(':');
 
       //! if hour equal MIDNIGHT 00 change to 24
         if (timeFromList[0] == 00) {
             timeFromList[0] = 24;
         }         
         if (startOrEnd[0] == 00) {
            startOrEnd[0] = 24;
         }

         if (type == 'end') {   
             // !compare years 
            if (Number(dateFromList[0]) < Number(startOrEndDate[0])) {
              return true;
            } 
             // !compare years if they are equal check month
            if (Number(dateFromList[0]) == Number(startOrEndDate[0])) {
                 //?compare months
                 if (Number(dateFromList[1]) < Number(startOrEndDate[1])){
                         return true;
                    }
                //?compare Months if they are equal check days
                if (Number(dateFromList[1]) == Number(startOrEndDate[1])){
                     //*compare days    
                    if (Number(dateFromList[2]) < Number(startOrEndDate[2])){
                        return true;
                    }
                    //* Compare days if they are equal check Time-Hour
                    if (Number(dateFromList[2]) == Number(startOrEndDate[2])){
                        //!compare Time
                        if(Number(timeFromList[0]) < Number(startOrEnd[0])){
                            return true;
                        }
                        //!compare Time if equal check Minutes
                        if(Number(timeFromList[0]) == Number(startOrEnd[0])){
                            //?compare minutes
                            if (Number(timeFromList[1]) <= Number(startOrEnd[1])){
                                return true
                            }
                          }
                    }
              } 
        }
                 return false;
            }  


          if (type == 'start') {    
              console.log( 'start');
       // !compare years 
       if (Number(dateFromList[0]) > Number(startOrEndDate[0])) {
        return true;
      } 
       // !compare years if they are equal check month
      if (Number(dateFromList[0]) == Number(startOrEndDate[0])) {
           //?compare months
           if (Number(dateFromList[1]) > Number(startOrEndDate[1])){
                   return true;
              }
          //?compare Months if they are equal check days
          if (Number(dateFromList[1]) == Number(startOrEndDate[1])){
               //*compare days    
              if (Number(dateFromList[2]) > Number(startOrEndDate[2])){
                  return true;
              }
              //* Compare days if they are equal check Time-Hour
              if (Number(dateFromList[2]) == Number(startOrEndDate[2])){
                  //!compare Time
                  if(Number(timeFromList[0]) > Number(startOrEnd[0])){
                      return true;
                  }
                  //!compare Time if equal check Minutes
                  if(Number(timeFromList[0]) == Number(startOrEnd[0])){
                      //?compare minutes
                      if (Number(timeFromList[1]) >= Number(startOrEnd[1])){
                          return true
                      }
                    }
              }
        } 
  }
           return false;
          }
}

function calcChosenDatesBalance(incArrObj,expArrObj,date1,date2){
const incomesTotal =  incArrObj.reduce((total,val) => total+val.amount ,0),
expensesTotal =expArrObj.reduce((total,val) => total+val.amount ,0),
balance =  incomesTotal -expensesTotal;
document.querySelector('#incomeAmount').innerHTML = incomesTotal;
document.querySelector('#expenseAmount').innerHTML = expensesTotal;

 document.querySelector('#balanceDisplay').innerHTML = balance;
 document.querySelector('#chosenDates').innerHTML = `Budget Balance Between <strong>${date1}</strong>  and <strong> ${date2}</strong> is: `;
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
function errorMessageDisplay(){
    document.querySelector('#dateTimeError').style.cssText = "display:block"
  }
   function deleteErrorMessage(){
    document.querySelector('#dateTimeError').style.cssText = "display:none"
     }
