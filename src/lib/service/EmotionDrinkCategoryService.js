import axios from "../axiosCustomize";

const getAllEmotionCategory = async (pageIndex = 1, pageSize = 6, search = '') => {
  return await axios.get(`api/emocategory/get?PageIndex=${pageIndex}&PageSize=${pageSize}&Search=${search}`);
};

const createEmotionCategory = async (data) => {
  return await axios.post(`api/emocategory/createEmotionCategory`, data);
};

const updateEmotionCategory = async (id, data) => {
  return await axios.patch(`api/emocategory/${id}`, data);
};

const deleteEmotionCategory = async (id) => {
  return await axios.delete(`api/emocategory/deleteEmotionCategory/${id}`);
};

export {
  getAllEmotionCategory,
  createEmotionCategory,
  updateEmotionCategory,
  deleteEmotionCategory,
};
