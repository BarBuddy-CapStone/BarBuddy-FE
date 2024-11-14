import axios from "../axiosCustomize";

const getDrinkBasedCateByID = async (cateId) => {
  return await axios.get(`api/v1/Drink/getDrinkBaedCate/${cateId}`)
}

const getAllDrink = async () => {
  return await axios.get(`api/v1/Drink`);
}

const getAllDrinkCustomer = async () => {
  return await axios.get(`api/v1/Drink/customer`);
}

const getOneDrink = async (drinkId) => {
  return await axios.get(`api/v1/Drink/${drinkId}`)
}

const addDrink = async (data) => {
  return await axios.post(`addDrink`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

const updateDrink = async (drinkId, data) => {
  return await axios.patch(`updateDrink/${drinkId}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

const getAllDrinkByBarId = async (barId) => {
  return await axios.get(`api/v1/Drink/customer/${barId}`)
}

export {
  getDrinkBasedCateByID,
  getAllDrink,
  getOneDrink,
  addDrink,
  updateDrink,
  getAllDrinkByBarId,
  getAllDrinkCustomer
}