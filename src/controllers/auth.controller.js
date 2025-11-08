const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/auth');

// Simple hardcoded users - replace with DB lookup for production
const users = [
    { username: 'admin', password: 'migue314', role: 'admin' },
    { username: 'user', password: 'userpass', role: 'user' }
];

class AuthController {
    static login(req, res) {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'username and password required' });

        const user = users.find(u => u.username === username && u.password === password);
        if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

        const payload = { username: user.username, role: user.role };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
        res.json({ token, user: payload });
    }
}

module.exports = AuthController;
