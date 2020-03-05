const express = require('express'),
app = express(),
mongoose = require('mongoose')
dbName = 'budget';
Joi = require('@hapi/joi');
app.use(express.json());


const incomesExpensesSchema = new mongoose.Schema({
  description: String,
  amount:Number,
});
//! History schema
const historySchema = new mongoose.Schema({
  operation:String,
  date:String,
  type:String,
  description:String,
  amount:Number
})
//?------> we took the schema and compiled it to module /// we can use it to create new inc/exp/define/find/remove (NewIncOrExp.find ...)
let Incomes = mongoose.model("Incomes",incomesExpensesSchema),
Expenses = mongoose.model("Expenses",incomesExpensesSchema),
History = mongoose.model("History",historySchema);


module.exports.getRequest = function getRequest(res,collection){ 
  //! retrieve data from DB 
  if (collection == "Incomes") {
    retrieveDataFromDB(Incomes,res)
  } 
  if (collection == "Expenses") {
    retrieveDataFromDB(Expenses,res)
  }
  if (collection == 'History') {
    retrieveDataFromDB(History,res)
  }
}

module.exports.postRequest = function postRequest(req,res,collection,history){
    const post = req.body,
    dateAndTime = post.dateAndTime;
    let {error} = checkIncExpValidation(post);
  //!check if request is valid if not return error message
    if (error){ console.log(error.details[0].message);
      return res.status(400).send(error.details[0].message);}
      //?post req handler -send data to db
      if (collection == "Incomes") {
        postDataToDatabase(Incomes,res,post,dateAndTime)
      } 
      if (collection == "Expenses") {
        postDataToDatabase(Expenses,res,post,dateAndTime)
      }
    }
  
module.exports.deleteRequest = function deleteRequest(req,res,collection){
    const id = req.params.id,
    dateAndTime = req.body.dateAndTime;  
  if (collection == "Incomes") {
    findAndDeleteDataFromDatabase(Incomes,res,dateAndTime,id,req);
  } 
  if (collection == "Expenses") {
    findAndDeleteDataFromDatabase(Expenses,res,dateAndTime,id,req);
  }
  }

//?/###---Validation---###////
function checkIncExpValidation(incOrExp){
      let schema = Joi.object({
          description: Joi.string().min(1).max(25).required(),
          amount: Joi.number().min(1).required(),
          dateAndTime:Joi.string()
      })
      return schema.validate(incOrExp);
}

//*--------Retrieve data from db-------------
function retrieveDataFromDB(constructor,res){
  constructor.find({},((err,constructor)=>{
    if (err) {
      console.log('get req err');
    }else{
      res.status(200).send(constructor)
    }}));
}

function postDataToDatabase(constructor,res,postData,dateAndTime){
      //?post with mongoose// we create the data using the schema
      constructor.create({
        description:postData.description,
        amount: postData.amount
      },(err,postObj)=>{
        if(err){console.log('error accrued');
        return res.status(500)
        }else{
          (constructor == Incomes) ? sendDataToHistoryCollection('post',dateAndTime,'incomes',postObj.description,postObj.amount,res) :
          sendDataToHistoryCollection('post',dateAndTime,'expenses',postObj.description,postObj.amount,res);
          return  res.status(201).send(postObj);
        }
      })
}

//? ----------delete from dataBase ----------
function findAndDeleteDataFromDatabase(constructor,res,dateAndTime,id,req){
  //!search if  obj is in database add to history and then remove
  constructor.findById(id, function (err, objToDelete) {
   if(err) return res.status(500);    
    (constructor == Incomes) ? sendDataToHistoryCollection('delete',dateAndTime,'incomes',objToDelete.description,objToDelete.amount,res) :
      sendDataToHistoryCollection('delete',dateAndTime,'expenses',objToDelete.description,objToDelete.amount,res);
        //! here we remove the obj from the data base and send to client status and the deleted obj
        constructor.findByIdAndRemove(id,(err)=>{
          if (err) {console.log('delete Error'); 
          return  res.status(500);
          }else{            
            return res.status(200).send(objToDelete);
          }
        });
  });
}
//!-----------send Data to history collection
function sendDataToHistoryCollection(operation,dateAndTime,type,description,amount,res){
    //?post with mongoose// we create the data using the schema
    History.create({
      operation:operation,
      date:dateAndTime,
      type:type,
      description:description,
      amount:amount
    },(err,historyObj)=>{    
        if(err){
        console.log('error  happened');
      res.status(500)
      }else{
        console.log('new action added to History');    
    }});
}
