import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
   res.send("<h1>User routes working ✅ </h1>");
   
});

export default router;
