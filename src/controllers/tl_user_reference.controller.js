const reposne_utils = require("../http/response.utility");
const tl_util = require("../services/tl_util.services");
const tl_water_plant_service = require("../services/tl_water_plant.services");
const tl_industry_service = require("../services/tl_industry.services");
const tl_contractor_service = require("../services/tl_contractor.services");
const tl_sub_contractor_service = require("../services/tl_sub_contractor.services");
const tl_driver_service = require("../services/tl_driver.services");
const tl_delivery_boy_service = require("../services/tl_delivery_boy.services");
const tl_vehicle_service = require("../services/tl_vehicle.services");
const tl_transport_agent_service = require("../services/tl_transport_agent.services");
const express = require('express');
const router = express.Router();
const moment = require('moment');



router.get('/user_id/:user_id/user_role/:user_role', async (req, res) => {
    let data = null;
    if (req.params.user_role === 'WP' && req.params.user_id) {
        data = await tl_water_plant_service.getByUserId(req.app.get('db'), req.user_session, req.params.user_id);
        return reposne_utils.send_response(req, res, 200, data)
    }

    if (req.params.user_role === 'IND' && req.params.user_id) {
        data = await tl_industry_service.getByUserId(req.app.get('db'), req.user_session, req.params.user_id);
        return reposne_utils.send_response(req, res, 200, data)
    }

    if (req.params.user_role === 'CTR' && req.params.user_id) {
        data = await tl_contractor_service.getByUserId(req.app.get('db'), req.user_session, req.params.user_id);
        return reposne_utils.send_response(req, res, 200, data)
    }
    if (req.params.user_role === 'SCTR' && req.params.user_id) {
        data = await tl_sub_contractor_service.getByUserId(req.app.get('db'), req.user_session, req.params.user_id);
        return reposne_utils.send_response(req, res, 200, data)
    }
    if (req.params.user_role === 'DR' && req.params.user_id) {
        data = await tl_driver_service.getByUserId(req.app.get('db'), req.user_session, req.params.user_id);
        return reposne_utils.send_response(req, res, 200, data)
    }

    if (req.params.user_role === 'DB' && req.params.user_id) {
        data = await tl_delivery_boy_service.getByUserId(req.app.get('db'), req.user_session, req.params.user_id);
        return reposne_utils.send_response(req, res, 200, data)
    }
    if (req.params.user_role === 'VEH' && req.params.user_id) {
        data = await tl_vehicle_service.getByUserId(req.app.get('db'), req.user_session, req.params.user_id);
        return reposne_utils.send_response(req, res, 200, data)
    }
    if (req.params.user_role === 'TPA' && req.params.user_id) {
        data = await tl_transport_agent_service.getByUserId(req.app.get('db'), req.user_session, req.params.user_id);
        return reposne_utils.send_response(req, res, 200, data)
    }
    try {
        data = await tl_util.getAll(req.app.get("db"), { parent_id: req.params.parent_id });
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});




module.exports = router;