const { Router } = require('express');
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);
routes.get('/search', SearchController.index);
routes.delete('/devs/:id', DevController.destroy);

module.exports = routes;


/*
const express = require('express');
const routes = express.Router();

const ProductController = require('./controllers/ProductController');

routes.get('/products', ProductController.index);  
routes.post('/products', ProductController.store);  
routes.get('/products/:id', ProductController.show);  
routes.put('/products/:id', ProductController.update);  
routes.delete('/products/:id', ProductController.destroy);  


module.exports = routes;
*/