import axios from "axios"

const getAllDrinkCate = async () => {
    return await axios.get('api/v1/DrinkCategory')
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

export {
    getAllDrinkCate,
    getOneDrinkCate,
    addDrinkCate,
    updDrinkCate,
    delDrinkCate
}