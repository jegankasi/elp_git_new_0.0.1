const jwt = require('jsonwebtoken');




const authorize_token = async (req, res, next) => {

    await authorization(req, res, next);
    // const auth_token = req.headers['authorization'];
    // const token = auth_token && auth_token.replace('Bearer ', '');
    // if (!token) return res.status(401).send({ status: 'error', data: 'Unauthorized!' });
    // jwt.verify(token, process.env.SECRET_JWT_KEY, (err, data) => {
    //     if (err) res.status(401).send({ status: 'error', data: 'Unauthorized' });
    //     req.user_details = data;
    //     next();
    // })
    next();
}

const authorization = (req, res, next) => {

}



// To be removed
const get_token = (req, res, next) => {
    if (!req.body.userId) return res.status(400).send({ status: 'error', data: 'Insufficient Data' });
    const user = { userId: req.body.userId };
    const access_token = jwt.sign(user, process.env.SECRET_JWT_KEY);
    res.status(200).send({ status: 'success', data: { access_token } });
}
module.exports = { authorize_token, get_token }