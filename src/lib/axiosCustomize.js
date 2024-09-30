import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:7069" //"https cái j đó", 
});

export default instance;
