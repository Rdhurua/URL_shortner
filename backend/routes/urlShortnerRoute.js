import express from 'express';
const router = express.Router();
import { createShortUrl, redirectToOriginal, getAllUrls,deleteURls} from '../controller/urlController.js';


router.post('/api/shorten', createShortUrl);
router.get('/api/admin/urls', getAllUrls);
router.delete('/api/admin/:id',deleteURls)

router.get('/:shortcode', redirectToOriginal);

export default router;