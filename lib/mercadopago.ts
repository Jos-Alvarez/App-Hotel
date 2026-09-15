import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configura el cliente de Mercado Pago usando el Access Token de tus variables de entorno
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  options: { timeout: 5000 }
});

export const preference = new Preference(client);
