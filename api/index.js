import cookie from "cookie";

export default function handler(req, res) {
  // Generate user_id and session_id (you can make these more random in production)
  const userId = req.cookies?.user_id || Math.random().toString(36).slice(2, 12);
  const sessionId = req.cookies?.session_id || Math.random().toString(36).slice(2, 14);

  res.setHeader('Set-Cookie', [
    cookie.serialize('user_id', userId, {
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds!
      path: '/',
      sameSite: 'Lax',
      secure: true
    }),
    cookie.serialize('session_id', sessionId, {
      maxAge: 2 * 60 * 60, // 2 hours in seconds
      path: '/',
      sameSite: 'Lax',
      secure: true
    })
  ]);
  res.status(200).send(`Hello from Vercel API! Cookies set: user_id=${userId}, session_id=${sessionId}`);
}