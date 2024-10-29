import axios from "../axiosCustomize";

const getAllBar = async () => {
  return await axios.get(`api/v1/Bar/admin/barmanager`)
}

const getBarProfile = async (barId) => {
  return await axios.get(`api/v1/Bar/admin/barProfile/${barId}`)
}

const getBarDetail = async (barId) => {
  return await axios.get(`api/v1/bar-detail/${barId}`);
}

const addBar = async (data) => {
  return await axios.post(`api/v1/Bar/admin/addBar`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export const updateBar = async (data) => {
  try {
    const response = await axios.patch(`api/v1/Bar/admin/updateBar`, data);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    if (error.response) {
      // Lỗi từ server với status code
      return {
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Lỗi không nhận được response
      throw new Error('Không nhận được phản hồi từ server');
    } else {
      // Lỗi khi setup request
      throw new Error('Có lỗi xảy ra khi gửi yêu cầu');
    }
  }
};

export {
  getAllBar,
  getBarProfile,
  addBar,
  getBarDetail
}