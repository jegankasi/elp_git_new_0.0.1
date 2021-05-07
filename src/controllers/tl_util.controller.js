const reposne_utils = require("../http/response.utility");
const tl_util = require("../services/tl_util.services");
const express = require('express');
const router = express.Router();
const moment = require('moment');

// router.get('/:parent_id', async (req, res) => {
//     try {
//         const data = await tl_util.get(req.app.get("db"), req.params.parent_id);
//         return reposne_utils.send_response(req, res, 200, data)
//     } catch (err) {
//         console.log("err-->", err);
//         return reposne_utils.send_response(req, res, 400, err)
//     }
// });

router.get('/date', async (req, res) => {
    // let date = moment('24/12/2019 09:15:00', "DD MM YYYY hh:mm:ss", true);
    //20 / 04 / 2021 12: 00: 00
    let s = new Date(2019, 6, 9, 11, 30, 0);
    console.log("date--->", s.toString());
    return reposne_utils.send_response(req, res, 200, s.toString())
})

router.get('/parent_id/:parent_id', async (req, res) => {
    try {
        const data = await tl_util.getAll(req.app.get("db"), { parent_id: req.params.parent_id });
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await tl_util.getAll(req.app.get("db"), {});
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});


router.post('/', async (req, res) => {
    try {
        const data = await tl_util.insert(req.app.get("db"), req.body);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});

router.put('/id/:id', async (req, res) => {

    try {
        const data = await tl_util.update(req.app.get("db"), req.body);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }

    //const data = await new Promise(resolve => resolve("hello"));
    //reposne_utils.send_response(req, res, 200, data)
});

router.delete('/id/:id', async (req, res) => {
    try {
        const data = await tl_util.deleteRecord(req.app.get("db"), req.params.id);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});

router.post('/saveAll', async (req, res) => {
    try {
        const data = await tl_util.saveAll(req.app.get("db"), req.body);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});


module.exports = router;