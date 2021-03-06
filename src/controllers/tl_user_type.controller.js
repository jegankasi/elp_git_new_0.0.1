const reposne_utils = require("../http/response.utility");
const tl_user_roles_service = require("../services/tl_user_roles.services");
const express = require('express');
const router = express.Router();



router.get('/user_type/:user_type', async (req, res) => {
    try {
        const data = await tl_user_roles_service.get(req.app.get("db"), { user_type: req.params.user_type });
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});





router.get('/', async (req, res) => {

    try {
        const data = await tl_user_roles_service.getAll(req.app.get("db"), req.query.id);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});


router.post('/', async (req, res) => {
    try {
        const data = await tl_user_roles_service.insert(req.app.get("db"), req.body);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});



router.put('/id/:id', async (req, res) => {
    try {
        const data = await tl_user_roles_service.update(req.app.get("db"), req.body);
        return reposne_utils.send_response(req, res, 200, data);
    } catch (err) {
        return res.status(403).send(err);
    }
});

router.delete('/id/:id', async (req, res) => {
    try {
        const data = await tl_user_roles_service.deleteRecord(req.app.get("db"), req.params.id);
        return reposne_utils.send_response(req, res, 200, data);
    } catch (err) {
        return res.status(403).send(err);
    }
});

router.post('/saveAll', async (req, res) => {
    try {
        const data = await tl_user_roles_service.saveAll(req.app.get("db"), req.body);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});


module.exports = router;