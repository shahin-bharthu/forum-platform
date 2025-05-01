import * as emailDigestServices  from "./emailDigestServices.js";
import { asyncErrorHandler } from "../../util/asyncErrorHandler.js";

const getFrequency = asyncErrorHandler(async (req,res,next) => {
    const {id} = req.user;
    const forumId = req.params.forumId;
    const frequency = await emailDigestServices.getFrequency(id, forumId);
    if(!frequency){
        return res.status(404).json({message: "No frequency found"});
    }
    return res.status(200).json({message: "Frequency fetched successfully", data: frequency});
})

const updateFrequency = asyncErrorHandler(async (req,res,next) => {
    const {id} = req.user;
    const forumId = req.params.forumId;
    const frequency = req.body.frequency;
    const frequencyRecord = await emailDigestServices.updateFrequency(id, forumId, frequency);
    if(!frequencyRecord){
        return res.status(404).json({message: "No frequency found"});
    }
    return res.status(200).json({message: "Frequency updated successfully", data: frequencyRecord});
}
)
const sendEmailDigest = asyncErrorHandler(async (req,res,next) => {
    //THIS IS TO TEST EMAIL DIGEST
    const {id} = req.user;
    const frequency = "WEEKLY";
    const dailyDigest = await emailDigestServices.sendEmailDigest(id, frequency);
    if(!dailyDigest){
        return res.status(404).json({message: "sent No daily digest found"});
    }
    return res.status(200).json({message: "monthly digest sent successfully", data: dailyDigest});
})

export {
    getFrequency,
    updateFrequency,
    sendEmailDigest
}