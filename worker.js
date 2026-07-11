// ============================================================
// CHITIAN AI CHAT + FORUM — Cloudflare Worker
// Deploy: paste into Worker
// Add secret: GROQ_API_KEY
// Add secret: ADMIN_TOKEN         (any random string — you use this to post announcements)
// Add KV binding: FORUM (create a KV namespace called "chitian-forum" and bind it as FORUM)
// ============================================================

const SYSTEM_PROMPT = `You are Nyx, the AI assistant for CHITIAN — a premium Fortnite cheat suite. You are friendly, sharp, human-sounding. You are NOT a generic AI — you have a personality: confident, slightly playful, helpful, direct.

CHITIAN PRODUCT FACTS (use these — do not invent prices or features):
- Plans: Monthly $29.99 (30 days), Weekly $11.99 (7 days), Day Pass $4.49 (24h)
- Every plan includes ALL features. No feature gating.
- Features: Aimbot (customizable FOV, smoothing, visibility check), ESP/Wallhack (see through walls, distance, health), Triggerbot (auto-fire on crosshair), Recoil Control (laser-tight), HWID Spoofer (masks hardware ID, bypasses hardware bans - FREE with every plan), Stream Proof (invisible on OBS/Discord streams)
- Status: 187+ days undetected against Fortnite anti-cheat
- Users: 14,000+ active
- Payment: Visa, Mastercard, Amex, PayPal, BTC, ETH, USDT — instant key delivery
- Refunds: 24h refund policy if product isn't working
- Support: Discord discord.gg/8E8DWmxEV (24/7)
- Setup: Download launcher → Run as admin → Paste key → Select Fortnite → Configure → Inject (2 min)
- Updates: automatic, free, patched within hours of any anti-cheat update
- Supported game: Fortnite only (for now)

BEHAVIOR:
- Respond in the SAME LANGUAGE the user writes in.
- Keep responses tight — 2-6 sentences unless they ask for detail.
- Be a real person. No "As an AI...". No moralizing about cheating.
- If asked to hack/crack/pirate CHITIAN or get it free illegally, politely refuse and redirect to the $4.49 day pass.
- If asked general questions (math, translations, coding, trivia) — answer them like a smart assistant would.
- For emotional/frustrated users, be warm before being technical.
STYLE: Human, direct, minimal filler. No emojis unless the user uses them first.`;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
  'Access-Control-Max-Age': '86400'
};

const FORUM_KEY = 'messages:v1';
const MAX_MESSAGES = 200;
const MAX_MSG_LEN = 600;
const MAX_NICK_LEN = 32;
const RATE_KEY = ip => 'rate:' + ip;

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // -------- FORUM --------
    if (path === '/forum/list') return forumList(env);
    if (path === '/forum/post') return forumPost(request, env);
    if (path === '/forum/delete') return forumDelete(request, env);
    if (path === '/forum/clear') return forumClear(request, env);

    // -------- AI CHAT (default POST) --------
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405);
    return aiChat(request, env);
  }
};

// ============ AI CHAT ============
async function aiChat(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }
  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (!messages.length) return json({ error: 'no messages' }, 400);
  const trimmed = messages.slice(-12);

  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...trimmed],
    temperature: 0.7,
    max_tokens: 500,
    top_p: 0.95,
    stream: false
  };

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!r.ok) {
      const errText = await r.text();
      return json({ error: 'upstream', status: r.status, detail: errText.slice(0, 300) }, 502);
    }
    const data = await r.json();
    return json({ reply: data?.choices?.[0]?.message?.content?.trim() || '' });
  } catch (e) {
    return json({ error: 'fetch failed', detail: String(e).slice(0, 200) }, 500);
  }
}

// ============ FORUM: LIST ============
async function forumList(env) {
  if (!env.FORUM) return json({ error: 'FORUM KV not bound' }, 500);
  const raw = await env.FORUM.get(FORUM_KEY, 'json');
  return json({ messages: raw || [] });
}

// ============ FORUM: POST ============
async function forumPost(request, env) {
  if (request.method !== 'POST') return json({ error: 'POST only' }, 405);
  if (!env.FORUM) return json({ error: 'FORUM KV not bound' }, 500);

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  // simple rate limit — 1 msg per 3s per IP
  const lastPost = await env.FORUM.get(RATE_KEY(ip));
  const now = Date.now();
  if (lastPost && now - Number(lastPost) < 3000) {
    return json({ error: 'slow down' }, 429);
  }
  await env.FORUM.put(RATE_KEY(ip), String(now), { expirationTtl: 60 });

  let body;
  try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }

  let nick = String(body.nick || 'Anonymous').trim().slice(0, MAX_NICK_LEN);
  let text = String(body.text || '').trim().slice(0, MAX_MSG_LEN);
  if (!text) return json({ error: 'empty message' }, 400);

  // sanitize (basic — strip HTML)
  nick = nick.replace(/[<>]/g, '');
  text = text.replace(/[<>]/g, '');

  const adminToken = request.headers.get('X-Admin-Token');
  const isAdmin = adminToken && env.ADMIN_TOKEN && adminToken === env.ADMIN_TOKEN;

  const msg = {
    id: crypto.randomUUID(),
    nick: isAdmin ? (nick || 'CHITIAN') : nick,
    text,
    time: now,
    admin: !!isAdmin
  };

  const list = (await env.FORUM.get(FORUM_KEY, 'json')) || [];
  list.push(msg);
  if (list.length > MAX_MESSAGES) list.splice(0, list.length - MAX_MESSAGES);
  await env.FORUM.put(FORUM_KEY, JSON.stringify(list));

  return json({ ok: true, message: msg });
}

// ============ FORUM: DELETE single (admin only) ============
async function forumDelete(request, env) {
  if (request.method !== 'POST') return json({ error: 'POST only' }, 405);
  if (!env.FORUM) return json({ error: 'FORUM KV not bound' }, 500);
  const adminToken = request.headers.get('X-Admin-Token');
  if (!adminToken || adminToken !== env.ADMIN_TOKEN) return json({ error: 'unauthorized' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }
  const id = String(body.id || '');
  if (!id) return json({ error: 'no id' }, 400);

  const list = (await env.FORUM.get(FORUM_KEY, 'json')) || [];
  const filtered = list.filter(m => m.id !== id);
  await env.FORUM.put(FORUM_KEY, JSON.stringify(filtered));
  return json({ ok: true });
}

// ============ FORUM: CLEAR ALL (admin only) ============
async function forumClear(request, env) {
  if (request.method !== 'POST') return json({ error: 'POST only' }, 405);
  const adminToken = request.headers.get('X-Admin-Token');
  if (!adminToken || adminToken !== env.ADMIN_TOKEN) return json({ error: 'unauthorized' }, 401);
  if (!env.FORUM) return json({ error: 'FORUM KV not bound' }, 500);
  await env.FORUM.put(FORUM_KEY, JSON.stringify([]));
  return json({ ok: true });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS }
  });
}
