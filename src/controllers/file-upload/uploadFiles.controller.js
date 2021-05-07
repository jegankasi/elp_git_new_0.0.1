const _ = require("underscore");
const reposne_utils = require("../../http/response.utility");
const fs = require("fs");
const path = require("path");
const { v1: uuidv1 } = require("uuid");
const express = require('express');
const router = express.Router();
const fileuploadService = require("../../services/tl_fileupload.services");




async function base64ToPNG(data) {
    try {
        data = data.replace(/^data:image\/png;base64,/, '');
        const uniqueId = uuidv1();
        const pngPath = path.resolve(__dirname, `../uploads/${uniqueId}.png`)

        await fs.writeFile(pngPath, data, 'base64')
    } catch (e) {
        throw (e)
    }
    return pngPath
}


router.post("/", async (req, res) => {
    try {
        if (((!req.files && !req.body) || (req.files && _.isEmpty(req.files.uploadFile) || (req.body && _.isEmpty(req.body.base64))))) {
            return res.status(400).send("No documents to upload");
        }
        if (req.body.base64) {
            let upload = await fileuploadService.insert(req.app.get("db"), req.body);
            return reposne_utils.send_response(req, res, 200, upload.id)
        }

        const uniqueId = uuidv1();
        const uploadFile = req.files.uploadFile;
        if (uploadFile.size > 2000000) {
            return res.status(412).send("file size too big");
        }
        let fileName = uniqueId + "." + uploadFile.mimetype.split("/")[1];
        const imagePath = path.join(__dirname, "../uploads/") + fileName;
        await uploadFile.mv(imagePath);
        return reposne_utils.send_response(req, res, 200, fileName)
    } catch (err) {
        return reposne_utils.send_response(req, res, 500, err)
    }
});

router.get('/base64/:id', async (req, res) => {
    try {
        let upload = await fileuploadService.get(req.app.get("db"), req.params.id);
        return reposne_utils.send_response(req, res, 200, upload.data);
    } catch (err) {
        return reposne_utils.send_response(req, res, 500, err);
    }
});

router.get('/file_name/:id', async (req, res) => {
    try {
        const imagePath = path.join(__dirname, "../uploads/") + req.params.id;
        var imageAsBase64 = fs.readFileSync(imagePath, 'base64')
        return reposne_utils.send_response(req, res, 200, imageAsBase64);
    } catch (err) {
        console.log(err)
    }
});

router.put('/base64/id/:id', async (req, res) => {
    try {
        let upload = await fileuploadService.update(req.app.get("db"), req.params.id, req.body);
        return reposne_utils.send_response(req, res, 200, "success");
    } catch (err) {
        throw err;
    }
});

router.delete('/deletefile/:id', async (req, res) => {
    try {
        const imagePath = path.join(__dirname, "../uploads/") + req.params.id;
        if (!fs.existsSync(imagePath)) {
            return reposne_utils.send_response(req, res, reposne_utils.serviceError("file was not there"));
        }
        fs.unlink(imagePath, (err) => {
            if (err) {
                return reposne_utils.send_response(req, res, reposne_utils.serviceError("file could not be deleted. please retry" + err, 500));
            }
        });
    } catch (err) {
        return reposne_utils.send_response(req, res, reposne_utils.serviceError("file could not be deleted. please retry" + err, 500));
    }
    ;
    return reposne_utils.send_response(req, res, reposne_utils.serviceResponse("file was deleted"));
});

module.exports = router;