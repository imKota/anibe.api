import { Router } from 'express';
import user from './user';
import auth from './auth';
import passwordReset from './password-reset';
import post from './post';
import statusmonitor from 'express-status-monitor';
import report from './report';
import news from './news';
import comment from './comment';
import notification from './notification';
import chats from './chats';
import messages from './messages';
const router = new Router();

/**
 * @apiDefine master Master access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine admin Admin access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine user User access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine listParams
 * @apiParam {String} [q] Query to search.
 * @apiParam {Number{1..30}} [page=1] Page number.
 * @apiParam {Number{1..100}} [limit=30] Amount of returned items.
 * @apiParam {String[]} [sort=-createdAt] Order of returned items.
 * @apiParam {String[]} [fields] Fields to be returned.
 */
router.use('/users', user);
router.use('/auth', auth);
router.use('/password-resets', passwordReset);
router.use('/posts', post);
router.use(statusmonitor());
router.use('/reports', report);
router.use('/news', news);
router.use('/comments', comment);
router.use('/notifications', notification);
router.use('/chats', chats);
router.use('/messages', messages);

router.get('/', (req, res) => res.status(200).json({}));

export default router;
