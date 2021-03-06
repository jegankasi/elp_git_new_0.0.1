const reposne_utils = require("../http/response.utility");
const tl_tripsheet = require("../services/tl_tripsheet.services");
const express = require('express');
const router = express.Router();



router.get('/get_transaction_products/transaction_id/:transaction_id', async (req, res) => {
    try {
        const data = await tl_tripsheet.get_transaction_products(req.app.get("db"), req.user_session, req.params);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});

router.get('/get_trip_sheet/transaction_id/:transaction_id', async (req, res) => {
    try {
        const data = await tl_tripsheet.getTripSheet(req.app.get("db"), req.user_session, req.params);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});


router.post('/transaction_id/:transaction_id', async (req, res) => {
    try {
        const data = await tl_tripsheet.insert(req.app.get("db"), req.user_session, req.body, req.query, req.params);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});


// router.put('/transaction_id/:transaction_id/tripsheet_id/:tripsheet_id', async (req, res) => {
//     try {
//         const data = await tl_tripsheet.update(req.app.get("db"), req.user_session, req.body, req.query, req.params);
//         return reposne_utils.send_response(req, res, 200, data)
//     } catch (err) {
//         return reposne_utils.send_response(req, res, 403, err)
//     }
// });





module.exports = router;
