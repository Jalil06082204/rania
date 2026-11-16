import 'dotenv/config';
import crypto from 'crypto';
import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  createInitialSanctuaryState,
  SanctuaryStatePayload,
  SERVER_INITIAL_ECG_NOTES,
  SERVER_INITIAL_FLASHCARDS,
  SERVER_INITIAL_JOURNAL_ENTRIES,
  SERVER_INITIAL_LOVE_MESSAGES,
  SERVER_INITIAL_MEMORIES,
  SERVER_INITIAL_OPEN_WHEN_LETTERS,
  SERVER_INITIAL_QUIZ_QUESTIONS,
  SERVER_INITIAL_STUDY_TOPICS,
  SERVER_INITIAL_THINGS_I_LOVE,
  SERVER_INITIAL_VOICE_RECORDINGS,
} from './server/sanctuaryData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// Cryptographic Password Hash & Session Configuration
// The plaintext password is NEVER stored in client or server code.
// Verified via scrypt key derivation + crypto.timingSafeEqual.
// ============================================================================
function cleanEnvValue(raw: string | undefined): string {
  if (!raw) return '';
  return raw.trim().replace(/^["']+|["']+$/g, '').trim();
}

const DEFAULT_SALT = '87a71dd8f69422a7537845252b186e34';
const DEFAULT_HASH_FOR_ENV_SALT =
  '00a3ae23364edd257e5aa17b962e5c44c008916b207243f25c93ce9fb80c84a07b6240ff388dd5383c6f8a942be292da2a3d0945c2acf72210e887153871a63b';
const LEGACY_MISMATCHED_HASH =
  'ac702936291e0446fcb51f3fe2580c4de30891c3b0f97aa60c139f80f13dec4d84cdbca7893c0f398791d9d7d5e7059a32fb79c26567f0cb60b8234fffd293e8';

const PASSWORD_SCRYPT_SALT =
  cleanEnvValue(process.env.SANCTUARY_PASSWORD_SALT) || DEFAULT_SALT;

const rawEnvHash = cleanEnvValue(process.env.SANCTUARY_PASSWORD_HASH).toLowerCase();

// If the environment has SANCTUARY_PASSWORD_SALT = 87a71dd8f69422a7537845252b186e34
// but still holds the previous fallback hash, use the hash matching the active salt.
const PASSWORD_SCRYPT_HASH_HEX =
  rawEnvHash &&
  rawEnvHash.length === 128 &&
  !(PASSWORD_SCRYPT_SALT === DEFAULT_SALT && rawEnvHash === LEGACY_MISMATCHED_HASH)
    ? rawEnvHash
    : DEFAULT_HASH_FOR_ENV_SALT;

const EXPECTED_HASH_BUFFER = Buffer.from(PASSWORD_SCRYPT_HASH_HEX, 'hex');

// Persistent Server Storage Directory (.data)
const DATA_DIR = path.join(__dirname, '.data');
const STATE_FILE = path.join(DATA_DIR, 'sanctuary-state.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const SECRET_FILE = path.join(DATA_DIR, 'session-secret.key');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getOrCreateSessionSecret(): string {
  const envSecret = cleanEnvValue(process.env.SESSION_SECRET);
  if (envSecret.length >= 32) {
    return envSecret;
  }
  try {
    if (fs.existsSync(SECRET_FILE)) {
      return fs.readFileSync(SECRET_FILE, 'utf-8').trim();
    }
    const generated = crypto.randomBytes(48).toString('hex');
    fs.writeFileSync(SECRET_FILE, generated, { mode: 0o600 });
    return generated;
  } catch {
    return crypto
      .createHash('sha256')
      .update(PASSWORD_SCRYPT_HASH_HEX + 'her-little-heart-hmac-key')
      .digest('hex');
  }
}

const SESSION_HMAC_SECRET = getOrCreateSessionSecret();
const SESSION_COOKIE_NAME = 'hlh_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// ============================================================================
// Rate Limiting & Temporary Lockout State
// ============================================================================
interface RateLimitRecord {
  failedCount: number;
  firstFailedAt: number;
  lockedUntil: number;
}

const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes temporary lockout
const rateLimitStore = new Map<string, RateLimitRecord>();

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown-ip';
}

// ============================================================================
// Constant-Time Password Verification (scrypt + timingSafeEqual)
// ============================================================================
function verifyPasswordConstantTime(inputPassword: string): boolean {
  if (typeof inputPassword !== 'string' || inputPassword.length > 256) {
    return false;
  }
  // Normalize Unicode encoding, accidental leading/trailing whitespace, internal spaces, and casing
  const normalized = inputPassword
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();

  const derivedKey = crypto.scryptSync(
    Buffer.from(normalized, 'utf8'),
    Buffer.from(PASSWORD_SCRYPT_SALT, 'utf8'),
    64
  );

  if (derivedKey.length !== EXPECTED_HASH_BUFFER.length) {
    return false;
  }
  return crypto.timingSafeEqual(derivedKey, EXPECTED_HASH_BUFFER);
}

// ============================================================================
// Server-Side Session Management & Cookie Signing
// ============================================================================
interface StoredSessions {
  [sessionId: string]: {
    createdAt: number;
    expiresAt: number;
  };
}

function loadSessions(): StoredSessions {
  try {
    if (!fs.existsSync(SESSIONS_FILE)) return {};
    const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    return JSON.parse(raw) as StoredSessions;
  } catch {
    return {};
  }
}

function saveSessions(sessions: StoredSessions): void {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), {
      mode: 0o600,
    });
  } catch (err) {
    console.error('Failed to persist session store:', err);
  }
}

function signSessionId(sessionId: string): string {
  const mac = crypto
    .createHmac('sha256', SESSION_HMAC_SECRET)
    .update(sessionId)
    .digest('hex');
  return `${sessionId}.${mac}`;
}

function verifySignedToken(signedToken: string | undefined): string | null {
  if (!signedToken || typeof signedToken !== 'string') return null;
  const parts = signedToken.split('.');
  if (parts.length !== 2) return null;
  const [sessionId, providedMac] = parts;
  if (!sessionId || !providedMac || providedMac.length !== 64) return null;

  const expectedMac = crypto
    .createHmac('sha256', SESSION_HMAC_SECRET)
    .update(sessionId)
    .digest('hex');

  const providedBuf = Buffer.from(providedMac, 'hex');
  const expectedBuf = Buffer.from(expectedMac, 'hex');
  if (
    providedBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(providedBuf, expectedBuf)
  ) {
    return null;
  }

  const sessions = loadSessions();
  const record = sessions[sessionId];
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    delete sessions[sessionId];
    saveSessions(sessions);
    return null;
  }
  return sessionId;
}

function createServerSession(): string {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const sessions = loadSessions();
  // Prune expired sessions
  for (const [id, rec] of Object.entries(sessions)) {
    if (now > rec.expiresAt) delete sessions[id];
  }
  sessions[sessionId] = {
    createdAt: now,
    expiresAt: now + SESSION_MAX_AGE_SECONDS * 1000,
  };
  saveSessions(sessions);
  return signSessionId(sessionId);
}

function revokeServerSession(signedToken: string | undefined): void {
  const sessionId = verifySignedToken(signedToken);
  if (!sessionId) return;
  const sessions = loadSessions();
  delete sessions[sessionId];
  saveSessions(sessions);
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    const key = pair.slice(0, idx).trim();
    const val = decodeURIComponent(pair.slice(idx + 1).trim());
    out[key] = val;
  }
  return out;
}

function isHttpsRequest(req: Request): boolean {
  if (req.secure) return true;
  const proto = req.headers['x-forwarded-proto'];
  if (typeof proto === 'string' && proto.includes('https')) return true;
  return process.env.NODE_ENV === 'production';
}

function setSessionCookie(req: Request, res: Response, signedToken: string): void {
  const secure = isHttpsRequest(req);
  // In HTTPS / Cloud Run preview iframe, use HttpOnly + Secure + SameSite=None
  // In local plain HTTP dev, use HttpOnly + SameSite=Lax
  const sameSite = secure ? 'None' : 'Lax';
  const cookieParts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(signedToken)}`,
    'Path=/',
    'HttpOnly',
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    `SameSite=${sameSite}`,
  ];
  if (secure) {
    cookieParts.push('Secure');
  }
  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

function clearSessionCookie(req: Request, res: Response): void {
  const secure = isHttpsRequest(req);
  const sameSite = secure ? 'None' : 'Lax';
  const cookieParts = [
    `${SESSION_COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'Max-Age=0',
    `SameSite=${sameSite}`,
  ];
  if (secure) {
    cookieParts.push('Secure');
  }
  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

function extractSignedToken(req: Request): string | undefined {
  const cookies = parseCookies(req.headers.cookie);
  if (cookies[SESSION_COOKIE_NAME]) {
    return cookies[SESSION_COOKIE_NAME];
  }
  const headerToken = req.headers['x-sanctuary-session'];
  if (typeof headerToken === 'string' && headerToken.length > 0) {
    return headerToken;
  }
  if (typeof req.query.st === 'string' && req.query.st.length > 0) {
    return req.query.st;
  }
  return undefined;
}

function requireSanctuaryAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = extractSignedToken(req);
  const validSessionId = verifySignedToken(token);
  if (!validSessionId) {
    res.status(401).json({
      authenticated: false,
      error: 'Authentication required to access Rania’s private sanctuary.',
    });
    return;
  }
  next();
}

// ============================================================================
// Persistent Sanctuary Data Store (.data/sanctuary-state.json)
// ============================================================================
function loadSanctuaryState(): SanctuaryStatePayload {
  try {
    if (!fs.existsSync(STATE_FILE)) {
      const initial = createInitialSanctuaryState();
      fs.writeFileSync(STATE_FILE, JSON.stringify(initial, null, 2), {
        mode: 0o600,
      });
      return initial;
    }
    const raw = fs.readFileSync(STATE_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as SanctuaryStatePayload;

    // Auto-upgrade legacy English sample Cardiology items to the French medical curriculum
    let migrated = false;
    if (
      Array.isArray(parsed.flashcards) &&
      parsed.flashcards.some(
        (f) =>
          (f.category as string) === 'Cardiac Physiology' ||
          f.question.startsWith('[Educational Sample]')
      )
    ) {
      const customCards = parsed.flashcards.filter((f) => !f.isSample);
      parsed.flashcards = [...customCards, ...SERVER_INITIAL_FLASHCARDS];
      migrated = true;
    }
    if (
      Array.isArray(parsed.quizQuestions) &&
      parsed.quizQuestions.some(
        (q) =>
          (q.category as string) === 'Cardiac Physiology' ||
          q.question.startsWith('[Educational Sample]')
      )
    ) {
      const customQuizzes = parsed.quizQuestions.filter((q) => !q.isSample);
      parsed.quizQuestions = [...customQuizzes, ...SERVER_INITIAL_QUIZ_QUESTIONS];
      migrated = true;
    }
    if (
      Array.isArray(parsed.ecgNotes) &&
      parsed.ecgNotes.some((n) => n.label === 'P Wave')
    ) {
      parsed.ecgNotes = [...SERVER_INITIAL_ECG_NOTES];
      migrated = true;
    }
    // Auto-add the new 5 Open When sample letters if the state only had the original 5
    if (Array.isArray(parsed.letters)) {
      const existingIds = new Set(parsed.letters.map((l) => l.id));
      const missingSampleLetters = SERVER_INITIAL_OPEN_WHEN_LETTERS.filter(
        (l) => !existingIds.has(l.id)
      );
      if (
        parsed.letters.filter((l) => l.isSample).length === 5 &&
        missingSampleLetters.length > 0
      ) {
        parsed.letters = [...parsed.letters, ...missingSampleLetters];
        migrated = true;
      }
    }
    if (!Array.isArray(parsed.loveMessages)) {
      parsed.loveMessages = [...SERVER_INITIAL_LOVE_MESSAGES];
      migrated = true;
    }
    if (!Array.isArray(parsed.thingsILove)) {
      parsed.thingsILove = [...SERVER_INITIAL_THINGS_I_LOVE];
      migrated = true;
    }
    if (migrated) {
      saveSanctuaryState(parsed);
    }
    return parsed;
  } catch {
    return createInitialSanctuaryState();
  }
}

function saveSanctuaryState(state: SanctuaryStatePayload): void {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), {
      mode: 0o600,
    });
  } catch (err) {
    console.error('Failed to save sanctuary state:', err);
  }
}

// ============================================================================
// Express Server Setup
// ============================================================================
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  // Security headers and strict private directory access guard
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');

    const reqPath = decodeURIComponent(req.path || '').toLowerCase();
    if (
      reqPath.startsWith('/.data') ||
      reqPath.startsWith('/server') ||
      reqPath === '/server.ts' ||
      reqPath === '/firestore.rules' ||
      reqPath === '/draft_firestore.rules' ||
      reqPath === '/firebase-blueprint.json' ||
      reqPath === '/security_spec.md' ||
      reqPath.startsWith('/.env')
    ) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    if (reqPath.startsWith('/api/auth') || reqPath.startsWith('/api/sanctuary')) {
      res.setHeader(
        'Cache-Control',
        'private, no-store, no-cache, must-revalidate'
      );
    }
    next();
  });

  app.use(express.json({ limit: '15mb' }));

  // 1. Check current session status
  app.get('/api/auth/session', (req: Request, res: Response) => {
    const token = extractSignedToken(req);
    const sessionId = verifySignedToken(token);
    if (!sessionId) {
      res.status(200).json({ authenticated: false });
      return;
    }
    res.status(200).json({ authenticated: true, sessionToken: token });
  });

  // 2. Verify password & unlock session
  app.post('/api/auth/unlock', (req: Request, res: Response) => {
    const ip = getClientIp(req);
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (record && record.lockedUntil > now) {
      const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      res.setHeader('Retry-After', String(retryAfterSeconds));
      res.status(429).json({
        authenticated: false,
        lockedOut: true,
        retryAfterSeconds,
        message: `Too many attempts. Please wait ${retryAfterSeconds}s and try again, my love ♡`,
      });
      return;
    }

    const password =
      req.body && typeof req.body.password === 'string'
        ? req.body.password
        : '';

    const isValid = verifyPasswordConstantTime(password);

    if (!isValid) {
      const prev = rateLimitStore.get(ip);
      let failedCount = 1;
      let firstFailedAt = now;

      if (prev && now - prev.firstFailedAt < ATTEMPT_WINDOW_MS) {
        failedCount = prev.failedCount + 1;
        firstFailedAt = prev.firstFailedAt;
      }

      const lockedUntil =
        failedCount >= MAX_FAILED_ATTEMPTS ? now + LOCKOUT_DURATION_MS : 0;

      rateLimitStore.set(ip, {
        failedCount,
        firstFailedAt,
        lockedUntil,
      });

      if (lockedUntil > now) {
        const retryAfterSeconds = Math.ceil((lockedUntil - now) / 1000);
        res.status(429).json({
          authenticated: false,
          lockedOut: true,
          retryAfterSeconds,
          message: `Too many attempts. Please wait ${retryAfterSeconds}s before trying again ♡`,
        });
        return;
      }

      res.status(401).json({
        authenticated: false,
        lockedOut: false,
        remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - failedCount),
        message: 'Not quite, my love. Try again ♡',
      });
      return;
    }

    // Password verified! Clear rate-limit record and issue HttpOnly session cookie
    rateLimitStore.delete(ip);
    const signedToken = createServerSession();
    setSessionCookie(req, res, signedToken);

    const state = loadSanctuaryState();
    res.status(200).json({
      authenticated: true,
      sessionToken: signedToken,
      state,
    });
  });

  // 3. Lock session (Sign Out)
  app.post('/api/auth/lock', (req: Request, res: Response) => {
    const token = extractSignedToken(req);
    revokeServerSession(token);
    clearSessionCookie(req, res);
    res.status(200).json({ authenticated: false });
  });

  // 4. Protected Private Sanctuary State Read
  app.get(
    '/api/sanctuary/state',
    requireSanctuaryAuth,
    (_req: Request, res: Response) => {
      const state = loadSanctuaryState();
      res.setHeader('Cache-Control', 'private, no-store');
      res.status(200).json({ state });
    }
  );

  // 5. Protected Private Sanctuary State Update
  app.put(
    '/api/sanctuary/state',
    requireSanctuaryAuth,
    (req: Request, res: Response) => {
      const current = loadSanctuaryState();
      const incoming = req.body as Partial<SanctuaryStatePayload>;

      const updated: SanctuaryStatePayload = {
        settings: incoming.settings ?? current.settings,
        studyTopics: Array.isArray(incoming.studyTopics)
          ? incoming.studyTopics
          : current.studyTopics,
        flashcards: Array.isArray(incoming.flashcards)
          ? incoming.flashcards
          : current.flashcards,
        quizQuestions: Array.isArray(incoming.quizQuestions)
          ? incoming.quizQuestions
          : current.quizQuestions,
        ecgNotes: Array.isArray(incoming.ecgNotes)
          ? incoming.ecgNotes
          : current.ecgNotes,
        letters: Array.isArray(incoming.letters)
          ? incoming.letters
          : current.letters,
        voiceRecordings: Array.isArray(incoming.voiceRecordings)
          ? incoming.voiceRecordings
          : current.voiceRecordings,
        memories: Array.isArray(incoming.memories)
          ? incoming.memories
          : current.memories,
        journalEntries: Array.isArray(incoming.journalEntries)
          ? incoming.journalEntries
          : current.journalEntries,
        loveMessages: Array.isArray(incoming.loveMessages)
          ? incoming.loveMessages
          : current.loveMessages,
        thingsILove: Array.isArray(incoming.thingsILove)
          ? incoming.thingsILove
          : current.thingsILove,
      };

      saveSanctuaryState(updated);
      res.status(200).json({ ok: true, state: updated });
    }
  );

  // 6. Protected Sample Restoration Endpoint
  app.post(
    '/api/sanctuary/reset',
    requireSanctuaryAuth,
    (req: Request, res: Response) => {
      const scope =
        req.body && typeof req.body.scope === 'string'
          ? req.body.scope
          : 'all';
      const current = loadSanctuaryState();
      let next: SanctuaryStatePayload;

      if (scope === 'studyTopics') {
        next = { ...current, studyTopics: [...SERVER_INITIAL_STUDY_TOPICS] };
      } else if (scope === 'flashcards') {
        next = { ...current, flashcards: [...SERVER_INITIAL_FLASHCARDS] };
      } else if (scope === 'quizQuestions') {
        next = { ...current, quizQuestions: [...SERVER_INITIAL_QUIZ_QUESTIONS] };
      } else if (scope === 'letters') {
        next = { ...current, letters: [...SERVER_INITIAL_OPEN_WHEN_LETTERS] };
      } else if (scope === 'memories') {
        next = { ...current, memories: [...SERVER_INITIAL_MEMORIES] };
      } else if (scope === 'journalEntries') {
        next = {
          ...current,
          journalEntries: [...SERVER_INITIAL_JOURNAL_ENTRIES],
        };
      } else if (scope === 'loveMessages') {
        next = {
          ...current,
          loveMessages: [...SERVER_INITIAL_LOVE_MESSAGES],
        };
      } else if (scope === 'thingsILove') {
        next = {
          ...current,
          thingsILove: [...SERVER_INITIAL_THINGS_I_LOVE],
        };
      } else if (scope === 'voiceRecordings') {
        next = {
          ...current,
          voiceRecordings: [...SERVER_INITIAL_VOICE_RECORDINGS],
        };
      } else {
        next = createInitialSanctuaryState();
      }

      saveSanctuaryState(next);
      res.status(200).json({ ok: true, state: next });
    }
  );

  // 7. Protected Clear Lists Endpoint
  app.post(
    '/api/sanctuary/clear',
    requireSanctuaryAuth,
    (_req: Request, res: Response) => {
      const current = loadSanctuaryState();
      const next: SanctuaryStatePayload = {
        ...current,
        studyTopics: [],
        journalEntries: [],
      };
      saveSanctuaryState(next);
      res.status(200).json({ ok: true, state: next });
    }
  );

  // 8. Protected Private Media Streaming Endpoint (Blocks unauthenticated photo access)
  const ALLOWED_PRIVATE_MEDIA: Record<string, string> = {
    memory_cafe_morning: path.join(
      __dirname,
      'server',
      'private_media',
      'memory_cafe_morning.jpg'
    ),
    memory_sunset_stroll: path.join(
      __dirname,
      'server',
      'private_media',
      'memory_sunset_stroll.jpg'
    ),
    memory_study_desk: path.join(
      __dirname,
      'server',
      'private_media',
      'memory_study_desk.jpg'
    ),
  };

  app.get(
    '/api/media/:photoId',
    requireSanctuaryAuth,
    (req: Request, res: Response) => {
      const photoId = req.params.photoId;
      const filePath = ALLOWED_PRIVATE_MEDIA[photoId];
      if (!filePath || !fs.existsSync(filePath)) {
        res.status(404).json({ error: 'Private media not found' });
        return;
      }
      res.setHeader('Cache-Control', 'private, max-age=3600');
      res.sendFile(filePath);
    }
  );

  // Vite Middleware (Development) or Static Dist (Production)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Her Little Heart server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
