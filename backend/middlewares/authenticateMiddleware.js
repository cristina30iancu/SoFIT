import jwt from 'jsonwebtoken';
import fs from 'fs';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        if (token) {
            const tokenValidation = JSON.parse(fs.readFileSync('./blacklist.json', 'utf-8'));
            if (tokenValidation.includes(token)) {
                return res.json({ msg: 'Login again' });
            }
            jwt.verify(token, process.env.normalToken, function (err, decoded) {
                if (err) {
                    res.json({ msg: 'Login again!' });
                } else {
                    const userId = decoded.userId;
                    const email = decoded.email;
                    console.log('aici ', userId)
                    req.body.userId = userId;
                    req.body.userEmail = email;
                    next();
                }
            });
        } else {
            res.json({ msg: 'Login again!!' });
        }
    } catch (error) {
        console.log('error from authenticate middleware', error.message);
        res.json({ err: error.message });
    }
};

export { authenticate };