import axios from '../axiosCustomize';
import useAuthStore from "../hooks/useUserStore";

const getAllTableTypesManager = async () => {
  return await axios.get(`api/TableType`);
};

const getAllTableTypes = async () => {
  return await axios.get(`api/TableType`);
};

const addTableType = async (data) => {
  const barId = useAuthStore.getState().userInfo?.identityId;
  return await axios.post(`api/TableType`, { ...data, barId });
};

const updateTableType = async (id, data) => {
  const barId = useAuthStore.getState().userInfo?.identityId;
  // Sửa lại endpoint để match với API
  return await axios.patch(`api/TableType/${id}`, { ...data, barId });
};

const deleteTableType = async (id) => {
  // Sửa lại endpoint để match với API
  return await axios.delete(`api/TableType/${id}`);
};

export {
  getAllTableTypes,
  getAllTableTypesManager,
  addTableType,
  updateTableType,
  deleteTableType,
};
