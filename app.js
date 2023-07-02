//jshint esversion:6

const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const date=require(__dirname+"/date.js");


const items=["buy food ","cook food","eat food"];
const workItems=[]
// var items=["buy food","cook food","eat food"];

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.listen(3000,function(){
    console.log("Server started on port 3000");
})



app.get("/",function(req,res){

    const day=date.getDate();
    res.render("list",{ListTitle:day ,newItems:items});
    
})

app.get("/work",function(req,res){
    res.render("list",{ListTitle:"Work list",newItems:workItems});
})

app.post("/",function(req,res){

let item=req.body.inputText;

if(req.body.list==="Work list"){
  
    workItems.push(item);
    res.redirect("/work");

}
else{

   items.push(item);
   res.redirect("/");
}
 
   
})

app.post("/work",function(req,res){
  
    var workitem=req.body.inputText
    workItems.push(workitem);
    res.redirect("/work")
    
})