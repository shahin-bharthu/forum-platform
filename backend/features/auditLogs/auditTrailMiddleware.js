import { db } from "../../config/connection.js";

const methodMappers = {
    "GET":"Fetching",
    "POST":"Adding",
    "PUT":"Updating",
    "DELETE":"Deleting"
}

export const logAuditTrails = (req,res,next) => {
    try{
        const originalJson = res.json;

        res.json = async function (body){
            const statusCode = res.statusCode; 
            const resourceName = req.originalUrl.split("/").pop(); 
            const activity = `${methodMappers[req.method]} ${resourceName} (Status: ${statusCode})`;
            
            await db.AuditTrail.create({
                url: req.originalUrl,
                activity: activity,
                params: JSON.stringify(req.params),
                query: JSON.stringify(req.query),                
            });
            return originalJson.call(this,body);
        }
        next();
    }catch(error){
        console.log("An error occurred logging audit trail");
        console.log(error.message);
        next();
    }
}