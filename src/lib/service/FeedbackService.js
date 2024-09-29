import axios from "../axiosCustomize";
const getAllFeedback = async () => {
  return await axios.get(`api/feedback/get`);
};

const getAllFeedbackByID = async (id) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };
  return await axios.get(`api/feedback/${id}`);
};

const createFeedBack = async (data) => {
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };
  return await axios.post(`api/feedback/createFeedBack`, data);
};

const UpdateFeedBack = async (id, data) => {
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };
  return await axios.patch(`api/feedback/${id}`, data);
};

const DeleteUpdateFeedBack = async (id) => {
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };
  return await axios.delete(`api/feedback/deleteEmotionCategory/${id}`, config);
};

export {
  getAllFeedback,
  getAllFeedbackByID,
  createFeedBack,
  UpdateFeedBack,
  DeleteUpdateFeedBack,
};
