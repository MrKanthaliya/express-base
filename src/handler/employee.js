import EmployeeRepository from '../service/repository/employee';
import Message from '../constants/messages';

const fetchEmployees = async(req, res, next) => {
    try {
        const employeeRepository = new EmployeeRepository();

        const employees = await employeeRepository.fetchEmployeesList();

        res.status(200).json({
            message: Message.FETCH_INFO_SUCCESSFULLY.format('Employees list'),
            data: employees,
        });
    } catch (err) {
        next(err);
    }
};

const createEmployees = async(req, res, next) => {
    try {
        const employeeRepository = new EmployeeRepository();
        await employeeRepository.createEmployee(req.body);

        res.status(200).json({
            message: 'Successfully created employee record',
        });
    } catch (err) {
        next(err);
    }
};


export { fetchEmployees, createEmployees};
