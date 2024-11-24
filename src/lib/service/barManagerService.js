import axios from "../axiosCustomize";

const getAllBar = async (pageIndex = 1, pageSize = 6, search = '') => {
  return await axios.get(`/api/v1/Bar/admin/barmanager?PageIndex=${pageIndex}&PageSize=${pageSize}&Search=${search}`);
}

const getAllBarsNoPage = async () => {
  return await axios.get(`/api/v1/Bar/admin/barmanager?PageSize=1000`);
}

const getBarProfile = async (barId) => {
  return await axios.get(`api/v1/Bar/admin/barProfile/${barId}`)
}

const getBarDetail = async (barId) => {
  return await axios.get(`api/v1/bar-detail/${barId}`);
}

const addBar = async (data) => {
  try {
    const response = await axios.post(`api/v1/Bar/admin/addBar`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
  getAllBarsNoPage,
  getBarProfile,
  addBar,
  getBarDetail
}