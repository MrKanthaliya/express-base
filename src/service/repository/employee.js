import MongoCommonService from './common';

class EmployeeService extends MongoCommonService {
    constructor(app = null) {
        super(app);
        const { Employee } = this.models;
        Object.assign(this, { Employee });
    }

    createEmployee(payload) {
        return this.Employee.create(payload);
    }

    fetchEmployeeDetails(employeeId) {
        return this.Employee.findById(employeeId)
            .lean();
    }

    fetchEmployeesList() {
        return this.Employee.find()
            .lean();
    }


}

export default EmployeeService;
