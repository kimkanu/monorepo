import { Router } from 'express';

import failed from './failed';
import logout from './logout';
import naver from './naver';
import success from './success';

const router = Router();

router.use('/naver', naver);
router.use('/logout', logout);
router.use('/success', success);
router.use('/failed', failed);

export default router;
