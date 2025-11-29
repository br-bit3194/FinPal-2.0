const {mongoose} = require("mongoose");

const financeSchema = new mongoose.Schema(
    { 
        user : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'User' ,
            required : true
        } ,
        income : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'Income' ,
            default : null
            
        } ,
        expense : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'Expense' ,
            default : null
        } ,
        isIncome : {
            type : Boolean ,
            default : true
        }
        
    } , 
    {
        timestamps : true
    }
)

module.exports = mongoose.model('Finance' , financeSchema)