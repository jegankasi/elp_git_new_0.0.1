const express = require('express');
const router = express.Router();
const authorization = require('../middlewares/authorization.middleware');
const tl_audit_log = require('../controllers/tl_audit_log.controller');
const tl_contractor = require('../controllers/tl_contractor.controller');
const tl_customers = require('../controllers/tl_customers.controller');
const tl_delivery_boy = require('../controllers/tl_delivery_boy.controller');
const tl_driver = require('../controllers/tl_driver.controller');
const tl_field_info = require('../controllers/tl_field_info.controller');
const tl_field_labels = require('../controllers/tl_field_labels.controller');
const tl_function = require('../controllers/tl_function.controller');
const tl_user_type = require('../controllers/tl_user_type.controller');
const tl_industry = require('../controllers/tl_industry.controller');
const tl_profile_function = require('../controllers/tl_profile_function.controller');
const tl_profile = require('../controllers/tl_profile.controller');
const tl_retention = require('../controllers/tl_retention.controller');
const tl_sequence = require('../controllers/tl_sequence.controller');
const tl_shop_keeper = require('../controllers/tl_shop_keeper.controller');
const tl_sub_contractor = require('../controllers/tl_sub_contractor.controller');
const tl_subscription = require('../controllers/tl_subscription.controller');
const tl_tables = require('../controllers/tl_tables.controller');
const tl_team = require('../controllers/tl_team.controller');
const tl_transport_agent = require('../controllers/tl_transport_agent.controller');
const tl_user = require('../controllers/tl_user.controller');
const tl_vehicle = require('../controllers/tl_vehicle.controller');
const tl_water_plant = require('../controllers/tl_water_plant.controller');
const tl_util = require('../controllers/tl_util.controller');
const tl_group = require('../controllers/tl_group.controller');

router.use('/tl_util', tl_util);
router.use('/tl_audit_log', tl_audit_log);
router.use('/tl_contractor', tl_contractor);
router.use('/tl_customer', tl_customers);
router.use('/tl_delivery_boy', tl_delivery_boy);
router.use('/tl_driver', tl_driver);
router.use('/tl_field_info', tl_field_info);
router.use('/tl_field_labels', tl_field_labels);
router.use('/tl_function', tl_function);
router.use('/tl_user_type', tl_user_type);
router.use('/tl_industry', tl_industry);
router.use('/tl_profile_function', tl_profile_function);
router.use('/tl_profile', tl_profile);
router.use('/tl_retention', tl_retention);
router.use('/tl_sequence', tl_sequence);
router.use('/tl_shop_keeper', tl_shop_keeper);
router.use('/tl_sub_contractor', tl_sub_contractor);
router.use('/tl_subscription', tl_subscription);
router.use('/tl_tables', tl_tables);
router.use('/tl_team', tl_team);
router.use('/tl_transport_agent', tl_transport_agent);
router.use('/tl_user', tl_user);
router.use('/tl_vehicle', tl_vehicle);
router.use('/tl_water_plant', tl_water_plant);
router.use('/tl_group', tl_group);

module.exports = router;
