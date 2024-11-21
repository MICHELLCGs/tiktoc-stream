const express = require('express');
const multer = require('multer');
const { uploadVideos } = require('../controllers/videoController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Configuración de almacenamiento temporal
const upload = multer({ dest: 'uploads/' }).array('videos', 10);

// Rutas protegidas
router.post('/upload', verifyToken, (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).send(`Multer error: ${err.message}`);
      } else if (err) {
        return res.status(500).send(`Server error: ${err.message}`);
      }
      next();
    });
  }, uploadVideos);

module.exports = router;
