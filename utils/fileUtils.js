const fs = require('fs');
const path = require('path'); // Importación necesaria
const { v4: uuidv4 } = require('uuid');

const generateUniqueName = (originalName) => {
  const extension = path.extname(originalName); // Usa path correctamente
  return `${uuidv4()}${extension}`; // Genera un nombre único con UUID
};

const cleanupFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error('Error deleting temp file:', err);
  });
};

module.exports = { generateUniqueName, cleanupFile };
