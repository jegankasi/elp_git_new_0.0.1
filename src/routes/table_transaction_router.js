const express = require('express');
const router = express.Router();

const tl_group_transaction = require('../table-transactions/tl_group.transaction');

router.use('/tl_group_transaction', tl_group_transaction);

module.exports = router;
