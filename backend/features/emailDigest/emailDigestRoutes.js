import { Router } from "express";
import { getFrequency, updateFrequency, sendEmailDigest} from "./emailDigestController.js";
const router = Router();

router.get("/frequency/:forumId", getFrequency);
router.patch("/frequency/:forumId", updateFrequency);
router.post("/send", sendEmailDigest); //THIS IS TO TEST EMAIL DIGEST

export default router;
