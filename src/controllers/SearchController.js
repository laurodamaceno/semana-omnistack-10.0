const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('./utils/parseStringAsArray');

module.exports = {
    async index(request, response) {

        const { latitude, longitude, techs } = request.query;

        const techsArray = parseStringAsArray(techs);

        //Busca de todos devs no raio de 10k
        // Filtrar por tecnologias
        const devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000, 
                }
            }
        });

        //console.log({devs});
        return response.json({devs});
    },
}