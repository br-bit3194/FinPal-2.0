const {mongoose} = require("mongoose")

const expenseSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId ,
            require : true
        } ,
        title : {
            type : String ,
            require : true
        } ,
        ammount : {
            type : Number ,
            require : true
        } , 
        category : {
            type : String , 
            enum : ['food' , 'rent' , 'travel' , 'shopping' , 'entertainment' , 'others'] , 
            required : true
        } ,
        transactionDate : {
            type : Date ,
            default : Date.now
        } ,
        source : {
            type : String ,
            default : 'Manual Entry'
        } ,
        confidence : {
            type : String ,
            enum : ['High', 'Medium', 'Low'] ,
            default : 'High'
        } ,
        
    } ,
    {
        timestamps : true
    }
)

module.exports = mongoose.model('Expense' , expenseSchema)