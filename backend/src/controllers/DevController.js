const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

// index, show, store, update, destroy

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();

        response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            const { name = login, avatar_url, bio } = apiResponse.data;

            //console.log(name, avatar_url, bio, github_username);

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
                location
            })

            // Filtrar as conexões que estão há no máximo 10km de distância
            // e que o novo dev tenha pelo menos uma das tecnologias filtradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }
        return response.json(dev);
    },

    async update(request, response) {
        let dev = await Dev.find({
            github_username: {
                $eq: request.params.git_username,
            },
        });


        if (dev) {
            const { name = dev[0].name, latitude = dev[0].location.coordinates[1], longitude = dev[0].location.coordinates[0], techs = dev[0].techs.toString() } = request.body;

            let techsArray = techs;

            //console.log(techsArray);
            if (techs != dev[0].techs) {
                techsArray = parseStringAsArray(techs);
            }
            //console.log(latitude);


            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            dev = await Dev.updateOne({
                name,
                techs: techsArray,
                location,
            });




        }
        return response.json(dev);

    },

    async destroy(request, response) {
        let dev = await Dev.find({
            github_username: {
                $eq: request.params.git_username,
            },
        });

        if (dev) {
            dev = await Dev.deleteOne({
                github_username: {
                    $eq: request.params.git_username,
                },
            });
        }

        return response.json(dev);
    }
};