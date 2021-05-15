const reposne_utils = require("../http/response.utility");
const tl_field_info_service = require("../services/tl_field_info.services");
const express = require('express');
const router = express.Router();



router.get('/form_name/:form_name', async (req, res) => {
  try {
    const data = await tl_field_info_service.getAll(req.app.get("db"), req.params.form_name);
    return reposne_utils.send_response(req, res, 200, data)
  } catch (err) {
    return reposne_utils.send_response(req, res, 400, err)
  }
});


router.get('/', async (req, res) => {
  try {
    let data;
    if (req.query.raw) {
      data = await tl_field_info_service.getRaw(req.app.get("db"), req.query.formId);
    } else {
      data = await tl_field_info_service.getAll(req.app.get("db"), req.params.id);
    }
    return reposne_utils.send_response(req, res, 200, data)
  } catch (err) {
    return reposne_utils.send_response(req, res, 400, err)
  }
});



router.post('/', async (req, res) => {
  try {
    const data = await tl_field_info_service.insert(req.app.get("db"), req.body);
    return reposne_utils.send_response(req, res, 200, data)
  } catch (err) {
    return reposne_utils.send_response(req, res, 403, err)
  }
});

router.put('/id/:id', async (req, res) => {
  try {

    const data = await tl_field_info_service.update(req.app.get("db"), req.body);
    return reposne_utils.send_response(req, res, 200, data)
  } catch (err) {
    return reposne_utils.send_response(req, res, 403, err)
  }
});

router.delete('/id/:id', async (req, res) => {
  try {
    const data = await tl_field_info_service.deleteRecord(req.app.get("db"), req.params.id);
    return reposne_utils.send_response(req, res, 200, data)
  } catch (err) {
    return reposne_utils.send_response(req, res, 403, err)
  }
});

router.post('/saveAll', async (req, res) => {
  try {
    const data = await tl_field_info_service.saveAll(req.app.get("db"), req.body);
    return reposne_utils.send_response(req, res, 200, data)
  } catch (err) {
    return reposne_utils.send_response(req, res, 403, err)
  }
})


module.exports = router;