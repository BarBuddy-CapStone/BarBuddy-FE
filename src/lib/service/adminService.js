// import axios from "../axiosCustomize";
// const getAllUser = async (index, size) => {
//   return await axios.get(`ManageAccount/GetAllUsers?PageIndex=${index}&PageSize=${size}`);
// };

// const getUserById = async (id) => {
//   return await axios.get(`ManageAccount/GetUserById/${id}`);
// };

// const getAllTransaction = async (index, size) => {
//   return await axios.get(
//     `Transaction/GetAllTransactions?PageIndex=${index}&PageSize=${size}`
//   );
// };

// const getAllMentor = async (index, size) => {
//   return await axios.get(`Mentor/GetAllMentor?PageIndex=${index}&PageSize=${size}`);
// };

// const addUser = async (data) => {
//   return await axios.post("ManageAccount/CreateUserForAdmin", data);
// };

// const updateUser = async (id, data) => {
//   return await axios.put(`ManageAccount/UpdateUser/${id}`, data);
// };

// const activateUser = async (id) => {
//   return await axios.patch(`ManageAccount/ActivateUser/${id}`);
// };

// const deactivateUser = async (id) => {
//   // Ensure semicolon is present
//   return await axios.patch(`ManageAccount/Deactivate/${id}`);
// };

// const verifyMentor = async (id) => {
//   return await axios.patch(`Mentor/VerifyMentor/${id}`);
// };

// const getTotalMoney = async () => {
//   return await axios.get("Transaction/GetTotalRevenueFromDeposit");
// };

// const getTotalUser = async () => {
//   return await axios.get("ManageAccount/NumberOfUsers");
// };

// export {
//   getAllUser,
//   getUserById,
//   addUser,
//   getAllMentor,
//   getAllTransaction,
//   verifyMentor,
//   updateUser,
//   activateUser,
//   deactivateUser,
//   getTotalUser,
//   getTotalMoney,
// };
