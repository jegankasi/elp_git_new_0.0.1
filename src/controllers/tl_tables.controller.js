const reposne_utils = require("../http/response.utility");
const tl_tables_service = require("../services/tl_tables.services");
const express = require('express');
const router = express.Router();



router.get('/:id', async (req, res) => {
    try {
        const data = await tl_tables_service.get(req.app.get("db"), req.params.id);
        reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        reposne_utils.send_response(req, res, 400, err)
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await tl_tables_service.getAll(req.app.get("db"), req.params.id);
        reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        reposne_utils.send_response(req, res, 400, err)
    }
});

router.post('/', async (req, res) => {
    try {
        const data = await tl_tables_service.insert(req.app.get("db"), req.body);
        return reposne_utils.send_response(req, res, 200, data);
    } catch (err) {
        return res.status(403).send(err);
    }
});

router.put('/', async (req, res) => {
    try {
        const data = await tl_tables_service.update(req.app.get("db"), req.body);
        return reposne_utils.send_response(req, res, 200, data);
    } catch (err) {
        return res.status(403).send(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const data = await tl_tables_service.deleteRecord(req.app.get("db"), req.params.id);
        return reposne_utils.send_response(req, res, 200, data);
    } catch (err) {
        return res.status(403).send(err);
    }
});


router.post('/saveAll', async (req, res) => {
    try {
        const data = await tl_tables_service.saveAll(req.app.get("db"), req.body);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});


module.exports = router;