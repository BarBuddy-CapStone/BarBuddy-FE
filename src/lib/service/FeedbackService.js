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

const getAllFeedBackForManager = async (barId, pageIndex, pageSize, search) => {
  return await axios.get(`api/feedback/manager?BarId=${barId}&PageIndex=${pageIndex}&PageSize=${pageSize}${search ? `&Search=${search}` : ''}`);
};

const getAllFeedbackByBookingID = async (bookingId) => {
  return await axios.get(`api/feedback/booking/${bookingId}`);
};

const getAllFeedbackByAdmin = async (barId = null, status = null, pageIndex = 1, pageSize = 10) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };
  let url = `api/feedback/admin?PageIndex=${pageIndex}&PageSize=${pageSize}`;
  
  if (status !== null) {
    url += `&Status=${status}`;
  }
  if (barId !== null) {
    url += `&BarId=${barId}`;
  }

  return await axios.get(url);
}

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

const UpdateStatusFeedBack = async (feedbackId, status) => {
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };
  return await axios.patch(`api/feedback/status?FeedbackId=${feedbackId}&Status=${status}`);
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
  getAllFeedbackByBookingID,
  createFeedBack,
  UpdateFeedBack,
  DeleteUpdateFeedBack,
  getAllFeedbackByAdmin,
  UpdateStatusFeedBack,
  getAllFeedBackForManager
};
