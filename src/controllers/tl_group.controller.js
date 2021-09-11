const reposne_utils = require("../http/response.utility");
const tl_group = require("../services/tl_group.services");
const express = require('express');
const router = express.Router();

router.get('/group_id/:group_id', async (req, res) => {
    try {
        const data = await tl_group.get(req.app.get('db'), req.user_session, req.params.group_id);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});

router.get('/groups', async (req, res) => {
    try {
        const data = await tl_group.getGroups(req.app.get('db'), req.user_session);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});


router.get('/', async (req, res) => {
    try {
        const data = await tl_group.getAll(req.app.get("db"), req.params.id);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});


router.post('/', async (req, res) => {
    try {
        const data = await tl_group.insert(req.app.get("db"), req.user_session, req.body);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});

router.post('/group_id/:group_id/type_of_user_number/:type_of_user_number/user_type/:user_type', async (req, res) => {
    try {
        const data = await tl_group.insertTypeOfUser(req.app.get("db"), req.user_session, req.params);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        console.log("err--->", err);
        return reposne_utils.send_response(req, res, 403, err)
    }
});


router.put('/id/:id', async (req, res) => {
    try {
        const data = await tl_group.update(req.app.get("db"), req.body);
        return reposne_utils.send_response(req, res, 200, data);
    } catch (err) {
        return res.status(403).send(err);
    }
});

router.delete('/id/:id', async (req, res) => {
    try {
        const data = await tl_group.deleteRecord(req.app.get("db"), req.params.id);
        return reposne_utils.send_response(req, res, 200, data);
    } catch (err) {
        return res.status(403).send(err);
    }
});

router.post('/saveAll', async (req, res) => {
    try {
        const data = await tl_group.saveAll(req.app.get("db"), req.body);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});

router.get('/group_name/:group_name', async (req, res) => {
    try {
        const data = await tl_group.groupOfUser(req.app.get("db"), req.user_session, req.params.group_name);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        console.log("err--->", err);
        return reposne_utils.send_response(req, res, 403, err)
    }
});

router.get('/getAllRoles', async (req, res) => {
    try {
        const data = await tl_group.getAllRoles(req.app.get("db"), req.user_session, req.params.group_name);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        console.log("err--->", err);
        return reposne_utils.send_response(req, res, 403, err)
    }
});


module.exports = router;