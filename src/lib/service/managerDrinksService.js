import axios from "axios"

const getDrinkBasedCate = async (cateId) => {
  return await axios.get(`api/v1/Drink/getDrinkBaedCate/${cateId}`)
}

const getAllDrink = async () => {
  return await axios.get(`api/v1/Drink`);
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

export {
  getDrinkBasedCate,
  getAllDrink,
  getOneDrink,
  addDrink,
  updateDrink
}