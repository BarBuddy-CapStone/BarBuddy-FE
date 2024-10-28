import axios from "../axiosCustomize";

const getAllEmotionCategory = async () => {
  return await axios.get(`api/emocategory/get`);
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
