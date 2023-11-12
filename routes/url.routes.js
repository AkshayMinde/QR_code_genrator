const express = require('express');
const { nanoid } = require("nanoid");
const db = require('../model/url-schema.model');
const dotenv = require('dotenv');
const validateUrl = require('../utils/validate-url.utils');

dotenv.config({ path: "../.env" });
const router = express.Router();

router.post('/urlShortener', async (req, res) => {
    const { OriginalUrl } = req.body;
    const base = process.env.BASE;

    const ID = nanoid();

    if (validateUrl(OriginalUrl)) {
        try {
            let url = await db.findOne({ OriginalUrl });

            if (url) {
                res.render("QRGen", {
                    OriginalUrl: url.OriginalUrl,
                    ShortUrl: url.ShortUrl,
                    qr_code: "",
                });
            } else {
                const shortUrl = `${base}/nav/${ID}`;
                url = new db({
                    OriginalUrl,
                    ShortUrl: shortUrl,
                    ID,
                    date: new Date()
                });

                await url.save();

                res.render("QRGen", {
                    OriginalUrl: url.OriginalUrl,
                    ShortUrl: url.ShortUrl,
                    qr_code: "",
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json("Internal Server Error");
        }
    } else {
        res.status(400).json('Invalid Original Url');
    }
});

module.exports = router;