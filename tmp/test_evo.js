const axios = require('axios');
require('dotenv').config({ path: 'f:/Downloads/Desarrollo Pagina Econos/Lead Keeper/backend/.env' });

const EVOLUTION_URL = process.env.EVOLUTION_URL;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;

console.log('Probando conexión a:', EVOLUTION_URL);
console.log('Con API KEY:', EVOLUTION_API_KEY);

const api = axios.create({
    baseURL: EVOLUTION_URL,
    headers: {
        'apikey': EVOLUTION_API_KEY
    }
});

api.get('/instance/fetchInstances')
    .then(res => {
        console.log('✅ Conexión Exitosa!');
        console.log('Instancias encontradas:', res.data.length);
    })
    .catch(err => {
        console.error('❌ Error de Conexión:');
        console.error(err.response?.data || err.message);
    });
