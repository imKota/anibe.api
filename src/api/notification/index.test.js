import request from 'supertest';
import { apiRoot } from '../../config';
import { signSync } from '../../services/jwt';
import express from '../../services/express';
import { User } from '../user';
import routes, { Notification } from '.';

const app = () => express(apiRoot, routes);

let userSession, adminSession, user, admin;

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' });
  admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' });
  userSession = signSync(user.id);
  adminSession = signSync(admin.id);
  await Notification.create({ target: admin.id, title: 'test', body: 'test body', type: 'system', picture: 'https://vk.com/favicon.ico', url: '', user });
});

test('POST /notifications 201 (admin)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({
      access_token: adminSession,
      target: admin.id,
      title: 'test',
      body: 'test body',
      type: 'system',
      picture: 'https://vk.com/favicon.ico',
      url: ''
    });
  expect(status).toBe(201);
  expect(typeof body).toEqual('object');
  expect(body.title).toEqual('test');
  expect(body.body).toEqual('test body');
  expect(body.type).toEqual('system');
  expect(body.picture).toEqual('https://vk.com/favicon.ico');
  expect(body.url).toEqual('');
});

test('POST /notifications 401 (user)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession });
  expect(status).toBe(401);
});

test('POST /notifications 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`);
  expect(status).toBe(401);
});

test('GET /notifications 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession });
  expect(status).toBe(200);
  expect(Array.isArray(body.rows)).toBe(true);
  expect(Number.isNaN(body.count)).toBe(false);
});

test('GET /notifications 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`);
  expect(status).toBe(401);
});
