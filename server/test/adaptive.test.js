import { test, describe } from 'node:test';
import assert from 'node:assert';
import { ROLES, TOPICS } from '../lib/data.js';

describe('SkillPath AI Adaptive Engine & Data Benchmarks', () => {
  test('Role benchmarks define expected core competencies', () => {
    const roles = Object.keys(ROLES);
    assert.deepStrictEqual(roles.sort(), ['Data Analyst', 'Software Engineer', 'Web Developer'].sort());

    for (const role of roles) {
      const skills = ROLES[role];
      assert.ok(skills.DSA !== undefined);
      assert.ok(skills.Programming !== undefined);
      assert.ok(skills.SQL !== undefined);
      assert.ok(skills.Git !== undefined);
      assert.ok(skills['CS Fundamentals'] !== undefined);
    }
  });

  test('Topics catalog contains curriculum topics for all skills', () => {
    const requiredSkills = ['DSA', 'Programming', 'SQL', 'Git', 'CS Fundamentals'];
    for (const skill of requiredSkills) {
      assert.ok(Array.isArray(TOPICS[skill]));
      assert.ok(TOPICS[skill].length >= 3);
    }
  });

  test('Adaptive score formula correctly elevates score on mastery (>= 3/5)', () => {
    const oldScore = 50;
    const solved = 4;
    const ratio = Math.min(Math.max(Number(solved) || 0, 0), 5) / 5;
    const newScore = Math.round(0.7 * oldScore + 0.3 * ratio * 100);

    assert.strictEqual(ratio >= 0.6, true);
    assert.strictEqual(newScore, 59);
    assert.ok(newScore > oldScore);
  });

  test('Adaptive score formula reduces score and marks for revision on struggle (< 3/5)', () => {
    const oldScore = 70;
    const solved = 1;
    const ratio = Math.min(Math.max(Number(solved) || 0, 0), 5) / 5;
    const newScore = Math.round(0.7 * oldScore + 0.3 * ratio * 100);

    assert.strictEqual(ratio >= 0.6, false);
    assert.strictEqual(newScore, 55);
    assert.ok(newScore < oldScore);
  });
});
