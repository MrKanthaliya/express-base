import Mongoose from 'mongoose';
import schemas from './models';


async function connectToDB() {

    const dbPath = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    const connOptions = {
        auth: { authSource: 'admin' },
        user: process.env.DB_USERNAME,
        pass: process.env.DB_PASSWORD,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
    };

    // If username or password is blank, don't use auth to connect
    if (!connOptions.user || !connOptions.pass) {
        delete connOptions.auth;
        delete connOptions.user;
        delete connOptions.pass;
    }
    // Make the connection to the database
    const connection = await Mongoose.createConnection(dbPath, connOptions);

    // Load models from schema definitions
    const models = {};
    schemas.forEach((schemaDef) => {
        models[schemaDef.name] = connection.model(schemaDef.name, schemaDef.schema, schemaDef.collection);
    });

    return { connection, models };
}

export default connectToDB;
