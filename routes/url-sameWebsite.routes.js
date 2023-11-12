const express = require('express');
const { nanoid } = require('nanoid');
const db = require('../model/url-schema.model');
const dotenv = require('dotenv');
const validateUrl = require('../utils/validate-url.utils');

dotenv.config({path: '../.env'});
const router = express.Router();

router.post('/urlShortenerSameWebsite', async (req, res) => {
    const { OriginalUrl } = req.body;
    const base = process.env.BASE; // Replace with your actual base URL
  
    const ID = nanoid();
  
    if (validateUrl(OriginalUrl)) {
      try {
        const shortUrl = `${base}/sameWebsite/${ID}`;
        const url = new db({
          OriginalUrl,
          ShortUrl: shortUrl,
          ID,
          date: new Date(),
        });
  
        await url.save();
  
        res.render('QRGen', {
          OriginalUrl: url.OriginalUrl,
          ShortUrl: url.ShortUrl,
          qr_code: '',
        });
      } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error');
      }
    } else {
      res.status(400).json('Invalid Original Url');
    }
});

router.get('/sameWebsite/:urlid', async (req, res) => {
    try {
      const url = await db.findOne({ ID: req.params.urlid });
  
      if (url) {
        await db.updateOne({ ID: req.params.urlid }, { $inc: { clickCount: 1 } });
        return res.redirect(302, 'https://www.last2braincells.com/');
      } else {
        res.status(404).json('Not found');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json('Server Error');
    }
  });
  
  module.exports = router;