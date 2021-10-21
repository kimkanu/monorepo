import { Router } from 'express';

import naver from './naver';

const router = Router();

router.use('/naver', naver);

export default router;
