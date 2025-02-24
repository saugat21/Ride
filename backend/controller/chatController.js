import Chat from "../model/chatModal.js";
import asyncHandler from "../middleware/asyncHandler.js";

// get all message for a ride
// /:rideId
const getMessage=asyncHandler(async(req,res)=>{
    try {
        const messages = await Chat.find({ rideId: req.params.rideId }).sort("timestamp");
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Error fetching messages" });
    }
})

//post message 
 const createMessage=asyncHandler(async(req,res)=>{
    const {rideId,user,driver,message}=req.body;
    try{
        const newMessage = new Chat({ rideId, sender, receiver, message });
        await newMessage.save();
        res.json(newMessage);
    }catch{
        res.status(500).json({ error: "Error sending message" });
    }
 })

 export{
    createMessage,getMessage
 }
