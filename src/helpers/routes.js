

const _ = require('lodash');
const config = require('config');
const path = require('path');
const express = require('express');

const fileHelper = require('./file');

const routesFolder = config.has('api.routesFolder')
    ? config.api.routesFolder
    : './src/routes';

const getRouteFiles = (cb) => {
    fileHelper.getFilesFromDir(routesFolder, (err, files) => {
        if (err) {
            cb(null, []);
        } else {
            cb(null, excludeRouteFiles(files ? files : []));
        }
    });
};

const excludeRouteFiles = (files) => {
    _.remove(files, (file) => {
        return (
            file === path.join(routesFolder, 'index.js') ||
      path.extname(file) !== '.js'
        );
    });
    return files;
};

const addInformationRoute = () => {
    var router = express.Router();
    router.get('/', (req, res) => {
        res.json({ message: 'Healthy Server' });
    });
    return router;
};

module.exports = {
    getRouteFiles: getRouteFiles,
    addInformationRoute: addInformationRoute,
};
