const reposne_utils = require("../http/response.utility");
const tl_login_service = require("../services/tl_login.services");
const formValidation = require('../configs/before.validation').formValidation;
const express = require('express');
const router = express.Router();


router.get('/:id', async (req, res) => {
    try {
        const data = await tl_login_service.get(req, req.params.id);
        reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        reposne_utils.send_response(req, res, 400, err)
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await tl_login_service.getAll(req.app.get("db"), req.params.id);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});

router.post('/', async (req, res) => {
    try {
        const data = await tl_login_service.authCheck(req.app.get("db"), req.body);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return res.status(403).send(err);
    }
});



module.exports = router;