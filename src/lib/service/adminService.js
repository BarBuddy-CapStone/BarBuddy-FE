import axios from 'axios';

export const getCustomerAccounts = async () => {
    try {
        const response = await axios.get("https://localhost:7069/api/v1/customer-accounts"); // Gọi API bằng axios
        return response.data;
    } catch (error) {
        console.error("Error fetching customer accounts:", error);
        throw error;
    }
};

export const getCustomerDetail = async (accountId) => {
    try {
        const response = await axios.get(`https://localhost:7069/api/v1/customer-account/detail?accountId=${accountId}`); // Gọi API để lấy chi tiết khách hàng
        return response.data;
    } catch (error) {
        console.error("Error fetching customer detail:", error);
        throw error;
    }
};

export const updateCustomerDetail = async (accountId, customerData) => {
    try {
        const response = await axios.patch(`https://localhost:7069/api/v1/customer-account?accountId=${accountId}`, customerData, {
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating customer detail:", error);
        throw error;
    }
};

export const updateStaffDetail = async (accountId, staffData) => {
    try {
        const response = await axios.patch(`https://localhost:7069/api/v1/staff-account?accountId=${accountId}`, staffData, {
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating customer detail:", error);
        throw error;
    }
};

export const getStaffAccounts = async () => {
    try {
        const response = await axios.get("https://localhost:7069/api/v1/staff-accounts", {
            headers: {
                'accept': '*/*'
            }
        });
        return response.data.items.map(staff => ({
            id: staff.accountId,
            name: staff.fullname,
            email: staff.email,
            phone: staff.phone,
            birthDate: new Date(staff.dob).toLocaleDateString(),
            bar: staff.bar,
            status: staff.status
        }));
    } catch (error) {
        console.error("Error fetching staff accounts:", error);
        throw error;
    }
};

export const getStaffDetail = async (accountId) => {
    try {
        const response = await axios.get(`https://localhost:7069/api/v1/staff-account/detail?accountId=${accountId}`, {
            headers: {
                'accept': '*/*'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching staff detail:", error);
        throw error;
    }
};

export const getBars = async () => {
    try {
        const response = await axios.get("https://localhost:7069/api/Bar/admin/barmanager", {
            headers: {
                'accept': '*/*'
            }
        });
        return response.data; // Trả về dữ liệu nhận được từ API
    } catch (error) {
        console.error("Error fetching bars:", error);
        throw error;
    }
};

export const createCustomer = async (customerData) => {
    try {
        const response = await axios.post("https://localhost:7069/api/v1/customer-account", customerData, {
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating customer:", error);
        throw error;
    }
};

export const createStaff = async (staffData) => {
    try {
        const response = await axios.post("https://localhost:7069/api/v1/staff-account", staffData, {
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            }
        });
        return response.data; // Trả về dữ liệu nhận được từ API
    } catch (error) {
        console.error("Error creating staff:", error);
        throw error;
    }
};
