import axios from "../axiosCustomize";
const getAllEmotionCategory = async () => {
  return await axios.get(`/api/emocategory/get`);
};

const getAllEmotionCategoryByID = async (id) => {
    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // };
    return await axios.get(`/api/emocategory/${id}`);
  };

const createEmotionCategory = async (data) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
  return await axios.post(`api/emocategory/createEmotionCategory`, data);
};

const updateEmotionCategory = async (id, data) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
  return await axios.patch(`api/emocategory/${id}`, data);
};

const deleteEmotionCategory = async (id) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
  return await axios.delete(`api/emocategory/deleteEmotionCategory/${id}`);
};

export {
  getAllEmotionCategory,
  getAllEmotionCategoryByID,
  createEmotionCategory,
  updateEmotionCategory,
  deleteEmotionCategory,
};
