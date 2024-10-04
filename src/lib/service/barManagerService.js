import axios from "../axiosCustomize";

const getAllBar = async () => {
  return await axios.get(`api/v1/Bar/admin/barmanager`)
}

const getBarProfile = async (barId) => {
  return await axios.get(`api/v1/Bar/admin/barProfile/${barId}`)
}

const addBar = async (data) => {
  return await axios.post(`api/v1/Bar/admin/addBar`, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
}

const updateBar = async (barId, data) => {
  return await axios.patch(
    `api/v1/Bar/admin/updateBar/${barId}`,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

export {
  getAllBar,
  getBarProfile,
  addBar,
  updateBar
}