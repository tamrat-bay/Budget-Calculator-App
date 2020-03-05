const express = require('express');
const mongoose = require('mongoose')
const app = express();
const path = require('path');
const PORT = process.env.PORT || 8080;
const budgetHandler = require('./incomeExpenseHandlers');
const publicPath = path.join(__dirname,'..','public');

app.use(express.json());
app.use(express.static(publicPath));

const incomesCollection = 'Incomes';
const historyCollection = 'History';
const expensesCollection = 'Expenses'; 
const mongoURL = require('./config/Keys').MongoURI;

mongoose.connect(mongoURL,{useNewUrlParser:true, useUnifiedTopology:true,useFindAndModify:false }).then(()=>{
  console.log('connected with mongoose ...');
});



//?------------##Incomes##------------//
app.get('/incomes',(req,res)=>{
    budgetHandler.getRequest(res,incomesCollection);
});
app.post('/incomes',(req,res)=>{
    budgetHandler.postRequest(req,res,incomesCollection);
});
app.delete("/incomes/:id",(req,res)=>{
    budgetHandler.deleteRequest(req,res,incomesCollection);
});
//!--------------##Expenses##---------//
app.get('/expenses',(req,res)=>{
    budgetHandler.getRequest(res,expensesCollection);
});

app.post('/expenses',(req,res)=>{
    budgetHandler.postRequest(req,res,expensesCollection);
});
app.delete("/expenses/:id",(req,res)=>{
    budgetHandler.deleteRequest(req,res,expensesCollection);
});
//?-------------##History##---------///
app.get('/history',(req,res)=>{
    budgetHandler.getRequest(res,historyCollection);
});

app.get('*',(req,res)=>{
    res.sendFile(publicPath + '/notFound.html')
});
 

app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`);
});
