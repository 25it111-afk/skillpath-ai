
import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import { ROLES, TOPICS } from '../lib/data.js';

const r = Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Generate personalized roadmap
r.post('/generate', auth, async (req, res) => {
  try {
    const { targetRole, scores } = req.body;
    const need = ROLES[targetRole];

    if (!need || !scores) {
      return res.status(400).json({
        error: 'targetRole and scores required'
      });
    }

    const u = await User.findById(req.uid);
    if (!u) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    const done = u.done || [];
    const weak = u.weak || [];

    const gaps = Object.keys(need)
      .map(k => ({
        skill: k,
        current: scores[k] ?? 0,
        required: need[k],
        gap: need[k] - (scores[k] ?? 0)
      }))
      .filter(g => g.gap > 0)
      .sort((a, b) => b.gap - a.gap);

    let weeks;
    let source = 'gemini';
    let geminiError;

    try {
      const prompt = `
You are a career mentor.
Target role: ${targetRole}.
Skill gaps: ${JSON.stringify(gaps)}.
Prioritize the largest gaps.
Skip completed topics: ${JSON.stringify(done)}.
Prioritize weak topics for revision: ${JSON.stringify(weak)}.

Return ONLY a JSON array with at most 8 weeks.
Each item must have this format:
{
  "week": 1,
  "skill": "DSA",
  "topic": "Arrays",
  "practice": ["Solve 5 problems"],
  "project": "Build a small project"
}
`;

      let out;

      // Retry temporary Gemini service errors up to 3 times
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          out = await ai.models.generateContent({
            model:
              process.env.GEMINI_MODEL ||
              'gemini-flash-latest',
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          });

          break;
        } catch (e) {
          const message = String(
            e.message || e
          );

          const temporaryError =
            /503|UNAVAILABLE|429|RESOURCE_EXHAUSTED|500|INTERNAL|502|504/.test(
              message
            );

          if (!temporaryError || attempt === 2) {
            throw e;
          }

          // Wait 1 second, then 2 seconds
          await new Promise(resolve =>
            setTimeout(
              resolve,
              1000 * (2 ** attempt)
            )
          );
        }
      }

      if (!out?.text) {
        throw new Error('Gemini returned an empty response');
      }

      weeks = JSON.parse(out.text);

      if (!Array.isArray(weeks)) {
        throw new Error('Gemini response is not a JSON array');
      }

      weeks = weeks.slice(0, 8);
    } catch (e) {
      geminiError = String(e.message || e);
      source = 'fallback';

      // Rule-based fallback roadmap
      weeks = gaps
        .flatMap(g =>
          (TOPICS[g.skill] || [])
            .filter(
              t => !done.includes(`${g.skill}|${t}`)
            )
            .sort(
              (a, b) =>
                Number(weak.includes(`${g.skill}|${b}`)) -
                Number(weak.includes(`${g.skill}|${a}`))
            )
            .slice(0, Math.ceil(g.gap / 15))
            .map(t => ({
              skill: g.skill,
              topic: t,
              practice: [
                `Solve 5 problems on ${t}`
              ],
              project: ''
            }))
        )
        .slice(0, 8)
        .map((w, i) => ({
          ...w,
          week: i + 1
        }));
    }

    await User.findByIdAndUpdate(req.uid, {
      targetRole,
      scores,
      roadmap: weeks
    });

    return res.json({
      source,
      geminiError,
      gaps,
      roadmap: weeks
    });
  } catch (e) {
    console.error('Roadmap generation error:', e.message);

    return res.status(500).json({
      error: 'Failed to generate roadmap'
    });
  }
});

// Update progress after practice
r.post('/practice', auth, async (req, res) => {
  try {
    const { skill, topic, solved } = req.body;

    const u = await User.findById(req.uid);
    if (!u) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    if (!u.scores || !skill || !topic) {
      return res.status(400).json({
        error: 'Generate a roadmap first'
      });
    }

    const ratio =
      Math.min(Math.max(Number(solved) || 0, 0), 5) / 5;

    const scores = {
      ...u.scores,
      [skill]: Math.round(
        0.7 * (u.scores[skill] ?? 0) +
        0.3 * ratio * 100
      )
    };

    const key = `${skill}|${topic}`;
    const done = new Set(u.done || []);
    const weak = new Set(u.weak || []);

    if (ratio >= 0.6) {
      done.add(key);
      weak.delete(key);
    } else {
      weak.add(key);
    }

    await User.findByIdAndUpdate(req.uid, {
      scores,
      done: [...done],
      weak: [...weak]
    });

    return res.json({
      scores,
      status:
        ratio >= 0.6
          ? 'completed'
          : 'needs-revision'
    });
  } catch (e) {
    console.error('Practice update error:', e.message);

    return res.status(500).json({
      error: 'Failed to update practice progress'
    });
  }
});

// Get current user's roadmap
r.get('/me', auth, async (req, res) => {
  try {
    const u = await User.findById(req.uid);

    if (!u) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    return res.json({
      targetRole: u.targetRole,
      scores: u.scores,
      roadmap: u.roadmap
    });
  } catch (e) {
    console.error('Fetch roadmap error:', e.message);

    return res.status(500).json({
      error: 'Failed to fetch roadmap'
    });
  }
});

export default r;
