const mongoose=require('mongoose');
const validMoongoseid=(_id)=>{
    const isValid=mongoose.Types.ObjectId.isValid(_id);
    if(!isValid)
    {
        throw new Error("Id is not correct, Come with correct id");
    }

};
module.exports={validMoongoseid};