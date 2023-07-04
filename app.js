//jshint esversion:6

const express=require("express");
const bodyParser=require("body-parser");
const _ =require("lodash");
const app=express();

const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://admin-janhavi:test%40123@cluster0.1nutoya.mongodb.net/todolistDB")

const currentDate = new Date();
const month = currentDate.toLocaleString('default', { month: 'long' });
const day = currentDate.getDate();
const formattedDate = `${month} ${day}`;



const itemsSchema={
    name:String
};

const listSchema={
    name:String,
    items:[itemsSchema]
}

const Item=mongoose.model("Item",itemsSchema);
const List=mongoose.model("List",listSchema);

const item1=new Item({
    name:"Welcome to Todo list "
})
const item2=new Item({
    name:"Hit the + button to add new item"
})
const item3=new Item({
    name:"Click the checkbox to delete an item"
})

const defaultArray=[item1,item2,item3];


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,function(){
    console.log("Server started running");
})



app.get("/",async function(req,res){
     
    
    try {
        var data = await Item.find({});
        console.log(data);
        if(data.length===0){
            Item.insertMany(defaultArray);
            res.redirect("/");
        }
        else{
            res.render('list', {ListTitle:formattedDate ,newItems:data }); // Pass the data to the template
        }
        
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    
        
    
    
})


app.post("/",async function(req,res){

let itemName=req.body.inputText;
let listName=req.body.list

const addItem=new Item({
    name:itemName
})

if(listName===formattedDate){
    addItem.save();
    res.redirect("/");
}else{
    

    try {
        const foundList = await List.findOne({name:listName});
        if(foundList){

             foundList.items.push(addItem)
             foundList.save();
             res.redirect("/"+listName);
         }
         else{
             
            console.log("not found list")
         }
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    
}
 
   
})

app.post("/delete",async function(req,res){
    const itemId=(req.body.deleteItem);
    const listName=req.body.listName;
    try{

        if(listName===formattedDate){
            
            await Item.findByIdAndRemove(itemId);
            res.redirect("/");
        }

        else{

            await List.findOneAndUpdate({name:listName},{$pull: {items:{_id:itemId}}})
            res.redirect("/"+listName);
        }
        
    }
    catch (error) {
        console.error('Error deleting document', error);
        res.status(500).send('Internal Server Error');
      }
    
    
});



app.get("/:customList",async function(req,res){
    const customName=_.capitalize(req.params.customList);
    try {
        const listData = await List.findOne({name:customName});
        if(!listData){

             const list=new List({
                 name:customName,
                 items:defaultArray
             });
             list.save();
             res.redirect("/"+customName);
            //  console.log("not exists");
         }
         else{
             res.render("list",{ListTitle:listData.name, newItems:listData.items})
            console.log("exists")
         }
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    
   
    
})



