import axios from "../axiosCustomize";

const getAllDrinkCate = async (pageIndex = 1, pageSize = 6, search = '') => {
    return await axios.get(`api/v1/DrinkCategory?PageIndex=${pageIndex}&PageSize=${pageSize}&Search=${search}`)
}

const getOneDrinkCate = async (drinkCateId) => {
    return await axios.get(`api/v1/DrinkCategory/${drinkCateId}`)
}

const addDrinkCate = async (data) => {
    return await axios.post(`addCateDrink`, data)
}

const updDrinkCate = async (drinkCateId, data) => {
    return await axios.patch(`updateCateDrink/${drinkCateId}`, data)
}

const delDrinkCate = async (drinkCateId) => {
    return await axios.patch(`deleteCateDrink/${drinkCateId}`)
}

const getAllDrinkEmo = async (emoId) => {
    return await axios.get(`api/v1/Drink/getDrinkBaedEmo/${emoId}`)
}

const getDrinkOfBar = async (search = '', cateId = '') => {
    return await axios.get(`api/v1/Drink/drinkOfBar?Search=${search}&cateId=${cateId}`);
}

export {
    getAllDrinkCate,
    getOneDrinkCate,
    addDrinkCate,
    updDrinkCate,
    delDrinkCate,
    getAllDrinkEmo,
    getDrinkOfBar
}