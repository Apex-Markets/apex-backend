const cookie = require("cookie");

module.exports = (req, res) => {
  // Manually parse cookies
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  const userId = cookies.user_id || Math.random().toString(36).slice(2, 12);
  const sessionId = cookies.session_id || Math.random().toString(36).slice(2, 14);

  // Set cookie domain for prod, omit for dev/local
  const isProd = process.env.NODE_ENV === 'production';
  const cookieDomain = isProd ? '.theapexinvestor.com' : undefined;

  res.setHeader('Set-Cookie', [
    cookie.serialize('user_id', userId, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      sameSite: 'Lax',
      secure: true,
      domain: cookieDomain
    }),
    cookie.serialize('session_id', sessionId, {
      maxAge: 2 * 60 * 60, // 2 hours
      path: '/',
      sameSite: 'Lax',
      secure: true,
      domain: cookieDomain
    })
  ]);
  res.status(200).send(
    `Hello from Vercel API! Cookies set: user_id=${userId}, session_id=${sessionId}`
  );
};