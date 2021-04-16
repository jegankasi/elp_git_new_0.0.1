const tl_sequences = require("../services/tl_sequence.services");
const tl_tables = require("../services/tl_tables.services");
const tl_user_type = require("../services/tl_user_type.services");
const reposne_utils = require("../http/response.utility");
const tl_function = require("../services/tl_function.services");
const tl_profile = require("../services/tl_profile.services");
const express = require('express');
const router = express.Router();


//inProgress
router.post('/', async (req, res) => {
    try {
        const db = req.app.get("db");
        let data = await db.withTransaction(async tx => {
            let tl_function_data = await tl_function.insert(tx, req.body.tl_function, "tokenId");
            let tl_profile_data = await tl_profile.insert(tx, req.body.tl_profile, "tokenId");
            return tl_profile_data;
        });
        return reposne_utils.send_response(req, res, 200, data);
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});

module.exports = router;