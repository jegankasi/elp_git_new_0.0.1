const reposne_utils = require("../http/response.utility");
const tl_contractor = require("../services/tl_contractor.services");
const express = require('express');
const router = express.Router();

router.get('/contractor_id/:contractor_id', async (req, res) => {
    try {
        const data = await tl_contractor.get(req.app.get("db"), req.user_session, req.params.contractor_id);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});


router.get('/:id', async (req, res) => {
    try {
        const data = await tl_contractor.getAll(req.app.get("db"), req.user_session, req.params.id);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});


router.post('/', async (req, res) => {
    try {
        const data = await tl_contractor.insert(req.app.get("db"), req.user_session, req.body);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});


router.put('/contractor_id/:contractor_id', async (req, res) => {
    try {
        const data = await tl_contractor.update(req.app.get("db"), req.user_session, req.body, req.params.contractor_id);
        return reposne_utils.send_response(req, res, 200, data);
    } catch (err) {
        return res.status(403).send(err);
    }
});

router.delete('/id/:id', async (req, res) => {
    try {
        const data = await tl_contractor.deleteRecord(req.app.get("db"), req.user_session, req.params.id);
        return reposne_utils.send_response(req, res, 200, data);
    } catch (err) {
        return res.status(403).send(err);
    }
});

router.post('/saveAll', async (req, res) => {
    try {
        const data = await tl_contractor.saveAll(req.app.get("db"), req.user_session, req.body);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
})


module.exports = router;