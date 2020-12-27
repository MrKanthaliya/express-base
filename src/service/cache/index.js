import RedisClient from './cache';
import EmployeeRepository from '../repository/employee';

class CacheService extends RedisClient {
    constructor(options = {}) {
        super(options);
    }

    fetchEmployeeDetails(name) {
        this.cache({
            segment: `#common-cache-service-${name}`,
            generateFunc: async(id) => {
                const employeeRepository = new EmployeeRepository();
                return employeeRepository.fetchEmployeeDetails(id);
            },
        });
        return this;
    }
}

export default CacheService;
