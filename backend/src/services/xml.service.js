const axios = require('axios');
const xml2js = require('xml2js');

const xmlService = {
    /**
     * Descarga y parsea el XML de propiedades
     * @param {string} url URL del XML
     */
    async parseProperties(url) {
        try {
            const response = await axios.get(url);
            const parser = new xml2js.Parser({ explicitArray: false });
            const result = await parser.parseStringPromise(response.data);

            // La estructura suele ser result.root.property o similar
            // Basado en el ejemplo S6DUSbJU/12174-web.xml, vamos a normalizarlo
            const propertiesRaw = result.ads?.ad || result.properties?.property || [];
            const normalized = (Array.isArray(propertiesRaw) ? propertiesRaw : [propertiesRaw]).map(p => ({
                externalId: p.id || p.ref,
                title: p.title || p.name || 'Sin título',
                description: p.description?.es || p.description || '',
                price: parseFloat(p.price) || 0,
                location: p.city || p.location || '',
                type: p.type || '',
                bedrooms: parseInt(p.bedrooms) || 0,
                bathrooms: parseInt(p.bathrooms) || 0,
                area: parseFloat(p.surface || p.area) || 0,
                images: this.extractImages(p),
                sourceUrl: p.url || ''
            }));

            return normalized;
        } catch (error) {
            console.error('Error al parsear XML de propiedades:', error.message);
            throw error;
        }
    },

    /**
     * Importa y guarda las propiedades en la base de datos
     */
    async importProperties(inmobiliariaId, url) {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        try {
            const properties = await this.parseProperties(url);

            for (const p of properties) {
                await prisma.property.upsert({
                    where: {
                        // Creamos un ID único compuesto o usamos el externalId si existe
                        id: `${inmobiliariaId}_${p.externalId}`
                    },
                    update: {
                        title: p.title,
                        description: p.description,
                        price: p.price,
                        location: p.location,
                        bedrooms: p.bedrooms,
                        bathrooms: p.bathrooms,
                        area: p.area,
                        images: JSON.stringify(p.images),
                        lastUpdate: new Date()
                    },
                    create: {
                        id: `${inmobiliariaId}_${p.externalId}`,
                        inmobiliariaId,
                        externalId: p.externalId,
                        title: p.title,
                        description: p.description,
                        price: p.price,
                        location: p.location,
                        bedrooms: p.bedrooms,
                        bathrooms: p.bathrooms,
                        area: p.area,
                        images: JSON.stringify(p.images),
                        sourceUrl: p.sourceUrl
                    }
                });
            }

            await prisma.$disconnect();
            return properties.length;
        } catch (error) {
            await prisma.$disconnect();
            throw error;
        }
    },

    extractImages(p) {
        if (p.images?.image) {
            const images = Array.isArray(p.images.image) ? p.images.image : [p.images.image];
            return images.map(img => typeof img === 'string' ? img : img.url || img._);
        }
        if (p.pictures?.picture) {
            const images = Array.isArray(p.pictures.picture) ? p.pictures.picture : [p.pictures.picture];
            return images.map(img => img.url || img);
        }
        return [];
    }
};

module.exports = xmlService;
