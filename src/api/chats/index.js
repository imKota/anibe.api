import { Router } from 'express';
import { middleware as query } from 'querymen';
import { middleware as body } from 'bodymen';
import { token } from '../../services/passport';
import { create, index, show, update, destroy, action } from './controller';
import Chats, { schema } from './model';
export { Chats, schema };

const router = new Router();
const { name, picture } = schema.tree;

/**
 * @api {post} /chats Create chats
 * @apiName CreateChats
 * @apiGroup Chats
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Chats's name.
 * @apiParam picture Chats's picture.
 * @apiSuccess {Object} chats Chats's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Chats not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ name, picture }),
  create);

/**
 * @api {post} /chats/:id/actions Add or remove user in chat
 * @apiName ActionsToChat
 * @apiGroup Chats
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam user_id User's id.
 * @apiParam action Action name (add, kick)
 * @apiSuccess {Object} chats Chats's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Chats not found.
 * @apiError 401 user access only.
 */
router.post('/:id/actions',
  token({ required: true }),
  body({ user_id: String, action: String }),
  action);

/**
 * @api {get} /chats Retrieve chats
 * @apiName RetrieveChats
 * @apiGroup Chats
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of chats.
 * @apiSuccess {Object[]} rows List of chats.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index);

/**
 * @api {get} /chats/:id Retrieve chats
 * @apiName RetrieveChats
 * @apiGroup Chats
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} chats Chats's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Chats not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show);

/**
 * @api {put} /chats/:id Update chats
 * @apiName UpdateChats
 * @apiGroup Chats
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Chats's name.
 * @apiParam picture Chats's picture.
 * @apiParam lastmessage Chats's lastmessage.
 * @apiSuccess {Object} chats Chats's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Chats not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ name, picture }),
  update);

/**
 * @api {delete} /chats/:id Delete chats
 * @apiName DeleteChats
 * @apiGroup Chats
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Chats not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy);

export default router;
