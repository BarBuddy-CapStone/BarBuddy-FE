import axios from "../axiosCustomize";

export const getCustomerAccounts = async (pageSize = 100, pageIndex = 1) => {
    return await axios.get(`api/v1/customer-accounts?pageSize=${pageSize}&pageIndex=${pageIndex}`);
};

export const getCustomerDetail = async (accountId) => {
    return await axios.get(`api/v1/customer-account/detail?accountId=${accountId}`);
};

export const updateCustomerDetail = async (accountId, data) => {
    return await axios.patch(`api/v1/customer-account?accountId=${accountId}`, data);
};

export const getManagerAccounts = async (pageSize = 100, pageIndex = 1) => {
    return await axios.get(`api/v1/manager-accounts?pageSize=${pageSize}&pageIndex=${pageIndex}`);
};

export const getManagerDetail = async (accountId) => {
    return await axios.get(`api/v1/manager-account/detail?accountId=${accountId}`);
};

export const updateManagerDetail = async (accountId, data) => {
    return await axios.patch(`api/v1/manager-account?accountId=${accountId}`, data);
};

export const updateStaffDetail = async (accountId, staffData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
            // 'Authorization': `Bearer ${token}`
        }
    };
    return await axios.patch(`api/v1/staff-account?accountId=${accountId}`, staffData, config);
};

export const getStaffAccounts = async (pageSize = 100, pageIndex = 1) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
        }
    };
    return await axios.get(`api/v1/staff-accounts?pageSize=${pageSize}&pageIndex=${pageIndex}`, config);
};

export const getStaffDetail = async (accountId) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
            // 'Authorization': `Bearer ${token}`
        }
    };
    return await axios.get(`api/v1/staff-account/detail?accountId=${accountId}`);
};

export const getBars = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
            // 'Authorization': `Bearer ${token}`
        }
    };
    return await axios.get("api/v1/Bar/admin/barmanager", config);
};

export const createCustomer = async (customerData) => {
    const config = { // Thêm config vào đây
        headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
            // 'Authorization': `Bearer ${token}`
        }
    };
    return await axios.post("api/v1/customer-account", customerData, config);
};

export const createStaff = async (staffData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
        }
    };
    return await axios.post("api/v1/staff-account", staffData, config);
};

export const createManager = async (managerData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
        }
    };
    return await axios.post("api/v1/manager-account", managerData, config);
};
