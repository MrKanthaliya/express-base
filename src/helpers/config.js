

const config = require('config');

const getApiUrl = () => {
    let urlBasePath = getApiRootUrl();
    urlBasePath += getApiBaseUrl();
    return urlBasePath;
};

const getApiRootUrl = () => {
    const api = config.get('api');
    return `${getApiProtocol()}://${api.domain}:${api.port}`;
};

const getApiBaseUrl = () => {
    return config.has('api.baseUrl') ? config.get('api.baseUrl') : '';
};

const getApiProtocol = () => {
    return config.has('api.protocol') ? config.get('api.protocol') : 'http';
};

const getApiName = () => {
    return config.has('api.name') ? config.get('api.name') : '';
};

const getRoutesFolder = () => {
    return config.has('api.routesFolder')
        ? config.get('api.routesFolder')
        : './src/routes';
};

const apiConfigIsValid = () => {
    return (
        config.has('api.protocol') &&
    config.has('api.domain') &&
    config.has('api.port')
    );
};

const swaggerConfigIsValid = () => {
    return config.has('swagger.url') && config.has('swagger.path');
};

module.exports = {
    getApiUrl: getApiUrl,
    getApiRootUrl: getApiRootUrl,
    getApiBaseUrl: getApiBaseUrl,
    getApiProtocol: getApiProtocol,
    getApiName: getApiName,
    getRoutesFolder: getRoutesFolder,
    apiConfigIsValid: apiConfigIsValid,
    swaggerConfigIsValid: swaggerConfigIsValid,
};
