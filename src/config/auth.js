module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'cambio_por_una_clave_muy_segura',
    jwtExpiresIn: '8h'
};
