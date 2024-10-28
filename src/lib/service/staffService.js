import axios from "../axiosCustomize";
import useAuthStore from "../hooks/useUserStore";

// Hàm helper để lấy barId từ userInfo
const getBarId = () => {
  const userInfo = useAuthStore.getState().userInfo;
  return userInfo?.identityId;
};

const getAllStaff = async (pageSize = 10, pageIndex = 1) => {
  const barId = getBarId();
  return await axios.get(`api/v1/staff-accounts/${barId}?PageSize=${pageSize}&PageIndex=${pageIndex}`);
};

const getStaffById = async (id) => {
  return await axios.get(`api/v1/staff-account/detail?accountId=${id}`);
};

const createStaff = async (data) => {
  return await axios.post(`api/v1/staff-accounts/create`, data);
};

const updateStaff = async (accountId, data) => {
  return await axios.patch(`api/v1/staff-account?accountId=${accountId}`, data);
};

export {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff
};
