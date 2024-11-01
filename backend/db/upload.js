const multer = require('multer');

// Configurar armazenamento em memória (podemos ajustar para local se necessário)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de tamanho (10MB)
}).fields([
    { name: 'file', maxCount: 1 },
    { name: 'historico', maxCount: 1 }
]);

module.exports = upload;
