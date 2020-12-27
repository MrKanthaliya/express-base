class MongoCommonService {
    constructor(instance) {
        if (!MongoCommonService.instance) {
            if (instance && instance.connection) {
                Object.assign(this, { connection: instance.connection });
            }
            if (instance && instance.models) {
                Object.assign(this, { models: instance.models });
            }
            MongoCommonService.instance = this;
        }
        Object.assign(this, MongoCommonService.instance);
    }
}

export default MongoCommonService;
