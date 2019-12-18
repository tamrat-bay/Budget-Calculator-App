const express = require('express'),
app = express(),
path = require('path'),
PORT = process.env.PORT || 8080,
routeHelper = require('./incomeExpenseHandlers'),
publicPath = path.join(__dirname,'..','public');
app.use(express.json());
app.use(express.static(publicPath));
let incomesCollection = 'Incomes',
historyCollection = 'History',
expensesCollection = 'Expenses'; //! make sure what you need in the module






//?------------##Incomes##------------//
app.get('/incomes',(req,res)=>{
    routeHelper.getRequest(res,incomesCollection);
});
app.post('/incomes',(req,res)=>{
    routeHelper.postRequest(req,res,incomesCollection);
});
app.delete("/incomes/:id",(req,res)=>{
    routeHelper.deleteRequest(req,res,incomesCollection);
});
//!--------------##Expenses##---------//
app.get('/expenses',(req,res)=>{
    routeHelper.getRequest(res,expensesCollection);
});

app.post('/expenses',(req,res)=>{
    routeHelper.postRequest(req,res,expensesCollection);
});
app.delete("/expenses/:id",(req,res)=>{
    routeHelper.deleteRequest(req,res,expensesCollection);
});
//?-------------##History##---------///
app.get('/history',(req,res)=>{
    routeHelper.getRequest(res,historyCollection);
});

app.get('*',(req,res)=>{
    res.send('<div style="text-align: center;"><img src="./images/pageNotFound.jpg" alt=""></div><div style="text-align: center;"><a href="/"><button style = "background-color: black;cursor: pointer;font-size: 2em;font-weight: 900;font-family: cursive;color: aliceblue;">Back To Menu</button></a></div>')
});
 


app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`);
    
});
