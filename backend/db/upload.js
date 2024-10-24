const multer = require('multer');

// Configurar armazenamento em memória (podemos ajustar para local se necessário)
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = upload;
