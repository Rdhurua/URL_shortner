import Url from '../models/urlModel.js';
import { nanoid } from 'nanoid';

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) return res.status(400).json({ error: 'originalUrl required' });

   //taken from outersource
    const urlPattern = /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/;
    if (!urlPattern.test(originalUrl)) {
      return res.status(400).json({ error: 'Invalid URL. Include http/https' });
    }

    //if already exist then return particulatz
    const existing = await Url.findOne({ originalUrl });
    if (existing) {
      return res.json({ shortCode: existing.shortCode, shortUrl: `${process.env.BASE_URL}/${existing.shortCode}` });
    }

    const shortCode = nanoid(6);
    const newUrl = await Url.create({ originalUrl, shortCode });

    res.json({ shortCode, shortUrl: `${process.env.BASE_URL}/${shortCode}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const redirectToOriginal = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const urlDoc = await Url.findOne({ shortCode: shortcode });
    if (!urlDoc) return res.status(404).send('Not found');

    // increment visit count
    urlDoc.visits += 1;
    await urlDoc.save();

    return res.redirect(urlDoc.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


export const getAllUrls = async (req, res) => {
  try {
    const key = req.query.key;
    if (key !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Forbidden' });

    const docs = await Url.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteURls= async (req, res) => {
  const { key } = req.query;
  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const deleted = await Url.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'URL not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
