//Call nhờ api chỗ này
import axios from "axios"

const getAllEmoCate = async () => {
  return await axios.get(`api/emocategory/get`)
}

export {
  getAllEmoCate
}