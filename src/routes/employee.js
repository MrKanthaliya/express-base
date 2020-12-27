const express = require('express');
const router = express.Router();
import {fetchEmployees, createEmployees} from '../handler/employee';

router.get('/employee', fetchEmployees);

router.post('/employee', createEmployees);

module.exports = router;
