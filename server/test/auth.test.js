import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import jwt from 'jsonwebtoken';
import app from '../server.js';
import authMiddleware from '../middleware/auth.js';

describe('SkillPath AI Backend Tests', () => {
  let server;
  let baseUrl;
  const testSecret = process.env.JWT_SECRET || 'test-jwt-secret-key-skillpath';

  before(async () => {
    // Ensure test environment variable for JWT secret if not present
    process.env.JWT_SECRET = testSecret;

    // Start ephemeral server on random available port
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  describe('Health Route', () => {
    test('GET /api/health should return ok: true', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.ok, true);
      assert.ok(data.timestamp);
    });
  });

  describe('Auth Middleware & JWT Security', () => {
    test('Rejects request with no authorization header', async () => {
      const res = await fetch(`${baseUrl}/api/roadmap/me`);
      assert.strictEqual(res.status, 401);
      const data = await res.json();
      assert.match(data.error, /Unauthorized/i);
    });

    test('Rejects request with malformed or invalid token', async () => {
      const res = await fetch(`${baseUrl}/api/roadmap/me`, {
        headers: {
          Authorization: 'Bearer invalid.token.payload'
        }
      });
      assert.strictEqual(res.status, 401);
      const data = await res.json();
      assert.match(data.error, /Unauthorized/i);
    });

    test('Rejects request with expired token', async () => {
      const expiredToken = jwt.sign(
        { id: 'user_123' },
        testSecret,
        { expiresIn: '-1s' }
      );

      const res = await fetch(`${baseUrl}/api/roadmap/me`, {
        headers: {
          Authorization: `Bearer ${expiredToken}`
        }
      });
      assert.strictEqual(res.status, 401);
      const data = await res.json();
      assert.match(data.error, /Unauthorized/i);
    });

    test('Direct unit test: authMiddleware populates req.uid for valid id payload', () => {
      const token = jwt.sign({ id: 'user_abc_456' }, testSecret);
      const req = {
        headers: {
          authorization: `Bearer ${token}`
        }
      };
      let nextCalled = false;
      const res = {
        status: () => res,
        json: () => res
      };
      const next = () => {
        nextCalled = true;
      };

      authMiddleware(req, res, next);
      assert.strictEqual(nextCalled, true);
      assert.strictEqual(req.uid, 'user_abc_456');
    });

    test('Direct unit test: authMiddleware populates req.uid for legacy uid payload', () => {
      const token = jwt.sign({ uid: 'user_legacy_789' }, testSecret);
      const req = {
        headers: {
          authorization: `Bearer ${token}`
        }
      };
      let nextCalled = false;
      const res = {
        status: () => res,
        json: () => res
      };
      const next = () => {
        nextCalled = true;
      };

      authMiddleware(req, res, next);
      assert.strictEqual(nextCalled, true);
      assert.strictEqual(req.uid, 'user_legacy_789');
    });

    test('Direct unit test: token isolation prevents user A from assuming user B identity', () => {
      const tokenUserA = jwt.sign({ id: 'user_A' }, testSecret);
      const tokenUserB = jwt.sign({ id: 'user_B' }, testSecret);

      const reqA = { headers: { authorization: `Bearer ${tokenUserA}` } };
      const reqB = { headers: { authorization: `Bearer ${tokenUserB}` } };
      const dummyRes = { status: () => dummyRes, json: () => dummyRes };

      authMiddleware(reqA, dummyRes, () => {});
      authMiddleware(reqB, dummyRes, () => {});

      assert.strictEqual(reqA.uid, 'user_A');
      assert.strictEqual(reqB.uid, 'user_B');
      assert.notStrictEqual(reqA.uid, reqB.uid);
    });
  });

  describe('Input Validation on Auth Endpoints', () => {
    test('POST /api/auth/register rejects missing fields', async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' })
      });
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.match(data.error, /Name, email and password are required/i);
    });

    test('POST /api/roadmap/generate rejects missing targetRole and scores', async () => {
      const validToken = jwt.sign({ id: 'some_user_id' }, testSecret);
      const res = await fetch(`${baseUrl}/api/roadmap/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validToken}`
        },
        body: JSON.stringify({})
      });
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.match(data.error, /targetRole and scores required/i);
    });
  });
});
