

import { join } from 'path';
import iConfig from 'config';
import { config } from 'dotenv';
config({ path: `${__dirname}/../.env` });
import { start as _start } from './server';
import { getApiBaseUrl, getRoutesFolder, getApiProtocol } from './helpers/config';

//What is node config dir

const start = () => {
    process.env.NODE_CONFIG_DIR = join(__dirname, '..', 'config');

    const port = iConfig.get('api.port');
    console.log(port);
    const baseUrl = getApiBaseUrl();
    const routesFolder = getRoutesFolder();
    const protocol = getApiProtocol();

    _start(port, protocol, baseUrl, routesFolder);
};

start();
