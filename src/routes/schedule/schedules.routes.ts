import { Router } from "express";
import {
  availability,
  meetings,
  schedule,
} from "../../controllers/schedule.controller";
const router = Router();



router.get("/availability/:useremail", availability);
router.post("/", schedule);
router.get("/meetings/:useremail", meetings);

 
export default router;
