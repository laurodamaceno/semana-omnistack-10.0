const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('./utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const { name = login, avatar_url, bio } = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })

            // Filtro de conexões que estão há no máximo 10km de distância 
            // E que o novo Dev tenha ao menos umas das Techs filtradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            );

            //console.log(sendSocketMessageTo);
            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }
    
        return response.json(dev);
    },

    async update(request, response) {

        const { github_username } = request.params;
        const { techs } = request.query;

        const techsArray = parseStringAsArray(techs);
        
        const dev = await Dev.update(
            { github_username },
            {
                $set: {
                    name,
                    avatar_url,
                    bio,
                    techs: techsArray,
                    location,
                }
            }
        );

        return response.json({ dev });

    },

    async destroy(request, response) {
        const { github_username } = request.params;

        const dev = await Dev.findOneAndDelete({ github_username });

        return response.json({ dev });

    },
}