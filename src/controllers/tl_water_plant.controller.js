const reposne_utils = require("../http/response.utility");
const tl_water_plant = require("../services/tl_water_plant.services");
const express = require('express');
const router = express.Router();

router.get('/water_plant_id/:water_plant_id', async (req, res) => {
    try {
        const data = await tl_water_plant.get(req.app.get("db"), req.user_session, req.params.water_plant_id);
        reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        reposne_utils.send_response(req, res, 400, err)
    }
});


router.get('/user_id/:user_id', async (req, res) => {
    try {
        const data = await tl_water_plant.getByUserId(req.app.get("db"), req.user_session, req.params.user_id);
        reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        reposne_utils.send_response(req, res, 400, err)
    }
});


router.get('/', async (req, res) => {
    try {
        const data = await tl_water_plant.getAll(req.app.get("db"), req.user_session);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});


router.post('/', async (req, res) => {
    try {
        const data = await tl_water_plant.insert(req.app.get("db"), req.user_session, req.body);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});

router.put('/water_plant_id/:water_plant_id', async (req, res) => {
    try {
        const data = await tl_water_plant.update(req.app.get("db"), req.user_session, req.body, req.params.water_plant_id);
        return reposne_utils.send_response(req, res, 200, data);
    } catch (err) {
        return res.status(403).send(err);
    }
});

router.delete('/id/:id', async (req, res) => {
    try {
        const data = await tl_water_plant.deleteRecord(req.app.get("db"), req.user_session, req.params.id);
        return reposne_utils.send_response(req, res, 200, data);
    } catch (err) {
        return res.status(403).send(err);
    }
});

router.post('/saveAll', async (req, res) => {
    try {
        const data = await tl_water_plant.saveAll(req.app.get("db"), req.user_session, req.body);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});

module.exports = router;