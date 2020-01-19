const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

// geralmente tem 5 functions index, show, store, destrou, update 

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
                    
            let { name, avatar_url, bio } = apiResponse.data;
                        
            if (!name) {
                name = apiResponse.data.login;        
            }
            
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
            
            // Filtrar conexoes que estao a no maximo 10 km de ditancia
            // e que o novo dev tenha ao menos uma das tecnologias filtradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);            
        }       
            
        return response.json(dev);
    },
    
    async destroy(request, response) {
        console.log(request);
        
        await Dev.findByIdAndRemove(request.params.id);

        return response.send({ message: "User deletado" });
    }

    /*
    async update(request, response) {
        const github_username = request.params.id;

        const { bio, techs, latitude, longitude } = request.body;
        
        const techsArray = parseStringAsArray(techs);

        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        };

        let dev = await Dev.findById(github_username);

        dev = await Dev.findByIdAndUpdate(github_username, request.body, { new: true });                              

        return response.json(dev);                             
    },    
    */


};