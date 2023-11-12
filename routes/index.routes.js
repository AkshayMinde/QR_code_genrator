const express = require("express");
const router = express.Router();
const db = require("../model/url-schema.model");
const qrcode = require("qrcode");

router.get('/nav/:urlid', async (req, res) => {
    try {
        const url = await db.findOne({ ID: req.params.urlid });

        if (url) {
            await db.updateOne(
                { ID: req.params.urlid },
                { $inc: { clickCount: 1 } }
            );
            return res.redirect(302, url.OriginalUrl);
        } else {
            res.status(404).json("Not found");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error");
    }
});

router.get("/Home", (req, res) => {
    res.status(200).render("Home", {});
});

router.get("/", (req, res) => {
    res.redirect("/Home");
});

router.get("/QRGen", (req, res) => {
    res.status(200).render("QRGen", {
        OriginalUrl: "",
        ShortUrl: "",
        qr_code: "",
    });
});

router.get("/QRDiff", (req, res) => {
    res.status(200).render("QRDiff", {
        OriginalUrl:"",
        ShortUrl:"",
        qr_code:"",
    });
});

router.post('/QRCode', (req, res) => {
    const { ShortlUrl, OriginalUrl } = req.body;

    var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        quality: 0.3,
        margin: 1.2,
        color: {
            dark: "#EC9316",
            light: "#FFFF"
        },
        width: 250,
    };

    if (ShortlUrl) {
        qrcode.toDataURL(ShortlUrl, opts, (err, src) => {
            res.render("QRGen", {
                OriginalUrl: OriginalUrl,
                ShortUrl: ShortlUrl,
                qr_code: src,
            });
        });
    } else {
        res.status(400).json("Short Url not found");
    }
});

router.post("/update", async (req, res) => {
    const { ShortlUrl, OriginalUrl } = req.body;
    try {
        const url = await db.findOne({ ShortUrl: ShortlUrl });
        if (url) {
            await db.updateOne({
                OriginalUrl: OriginalUrl,
            });
            return res.render("QRgen", {
                OriginalUrl: OriginalUrl,
                ShortUrl: ShortlUrl,
                qr_code: "",
            });
        } else {
            res.status(404).json("Not found");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
});

module.exports = router;
