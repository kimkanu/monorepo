import { Router } from 'express';

import logout from './logout';
import naver from './naver';

const router = Router();

router.use('/naver', naver);
router.use('/logout', logout);

export default router;
