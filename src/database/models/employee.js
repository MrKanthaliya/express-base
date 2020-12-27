import { Schema } from 'mongoose';

const Employee = new Schema(
    {
        first_name: { type: String, required: true },
        middle_name: { type: String },
        last_name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        deleted_at: { type: Date, default: null },
    },
    {
        minimize: false,
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    },
);

export default Employee;
