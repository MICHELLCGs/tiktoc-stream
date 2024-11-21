const { exec } = require('child_process');
const { cleanupFile, generateUniqueName } = require('../utils/fileUtils');

const uploadVideos = (req, res) => {
  const videoFiles = req.files;

  if (!videoFiles || videoFiles.length === 0) {
    return res.status(400).send('No video files uploaded.');
  }

  const uploadPromises = videoFiles.map((videoFile) => {
    const uniqueName = generateUniqueName(videoFile.originalname); // Incluye la extensión
    const tempPath = videoFile.path;
    const remotePath = `tiktoc:/${uniqueName}`; // Asegura que el destino tenga el nombre con extensión

    return new Promise((resolve, reject) => {
      const command = `rclone copyto ${tempPath} ${remotePath} --config ${process.env.RCLONE_CONFIG_PATH}`; // Usa "copyto" en lugar de "copy"
      exec(command, (error) => {
        cleanupFile(tempPath); // Limpiar archivo temporal
        if (error) {
          reject(`Error uploading ${videoFile.originalname}: ${error.message}`);
        } else {
          resolve({ originalName: videoFile.originalname, uniqueName });
        }
      });
    });
  });

  Promise.all(uploadPromises)
    .then((results) => res.status(200).json({ uploadedVideos: results }))
    .catch((error) => res.status(500).send(`Error uploading videos: ${error}`));
};

module.exports = { uploadVideos };
