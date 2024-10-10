import * as signalR from "@microsoft/signalr";
import axios from "../../axiosCustomize";

// Lấy base URL từ axios instance, nhưng đảm bảo sử dụng HTTPS
const BASE_URL = axios.defaults.baseURL;

// Cập nhật URL của SignalR hub
const HUB_URL = `${BASE_URL}bookingHub`;

// Tạo kết nối
const connection = new signalR.HubConnectionBuilder()
  .withUrl(HUB_URL, {
    skipNegotiation: false,
    transport: signalR.HttpTransportType.WebSockets,
    accessTokenFactory: () => {
      // Thêm logic để lấy token nếu cần
      return localStorage.getItem('token');
    }
  })
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Debug)  // Thay đổi level logging để debug
  .build();

// Bắt đầu kết nối
async function startConnection() {
  try {
    await connection.start();
    console.log("SignalR Connected.");
    console.log("Connection ID:", connection.connectionId);
    
    connection.invoke("CheckConnection")
      .then(() => console.log("Connection check successful"))
      .catch(err => console.error("Connection check failed:", err));
      
  } catch (err) {
    console.log("SignalR Connection Error: ", err);
    console.log("Error details:", err.toString());
    if (err instanceof Error) {
      console.log("Stack trace:", err.stack);
    }
    setTimeout(startConnection, 5000);
  }
}

connection.onclose(async () => {
  console.log("SignalR Connection closed. Attempting to reconnect...");
  await startConnection();
});

startConnection();

// Hàm để gửi tin nhắn (nếu cần)
export const sendMessage = async (method, ...args) => {
  try {
    await connection.invoke(method, ...args);
  } catch (err) {
    console.error(err);
  }
};

// Thêm một listener cho tất cả các tin nhắn
connection.on("*", (name, message) => {
  console.log(`Received message '${name}':`, message);
});

// Export connection để sử dụng ở nơi khác
export const hubConnection = connection;

// Thêm các listener cho các sự kiện cụ thể
connection.on("TableHoId", (tableId) => {
  console.log("Table held:", tableId);
  // Xử lý sự kiện khi bàn được giữ
});

connection.on("TableReleased", (tableId) => {
  console.log("Table released:", tableId);
  // Xử lý sự kiện khi bàn được giải phóng
});

// Thêm vào cuối file
export const getTableStatusFromSignalR = async (barId, tableId) => {
  try {
    const status = await connection.invoke("GetTableStatus", barId, tableId);
    return status;
  } catch (error) {
    console.error("Error getting table status from SignalR:", error);
    return null;
  }
};