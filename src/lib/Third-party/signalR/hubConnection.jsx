import * as signalR from "@microsoft/signalr";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const HUB_URL = `${BASE_URL}bookingHub`;

const connection = new signalR.HubConnectionBuilder()
  .withUrl(HUB_URL, {
    skipNegotiation: false,
    transport: signalR.HttpTransportType.WebSockets,
    accessTokenFactory: () => {
      return sessionStorage.getItem("authToken");
    },
  })
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Debug)
  .build();

async function startConnection() {
  try {
    await connection.start();
    console.log("SignalR Connected.");
  } catch (err) {
    console.error("SignalR Connection Error: ", err);
    setTimeout(startConnection, 5000);
  }
}

connection.onclose(async () => {
  console.log("SignalR Connection closed. Attempting to reconnect...");
  await startConnection();
});

startConnection();

export const hubConnection = connection;

// Chỉ giữ lại các event listeners cần thiết
connection.on("TableHoId", (response) => {
  console.log("Table held via SignalR:", response);
  document.dispatchEvent(
    new CustomEvent("tableStatusChanged", {
      detail: {
        tableId: response.tableId,
        isHeld: true,
        holderId: response.accountId,
        accountId: response.accountId,
        status: 2,
        date: response.date,
        time: response.time
      }
    })
  );
});

connection.on("TableReleased", (response) => {
  console.log("Table released:", response);
  document.dispatchEvent(
    new CustomEvent("tableStatusChanged", {
      detail: {
        tableId: response.tableId,
        isHeld: false,
        holderId: null,
        accountId: null,
        status: 1,
        date: response.date,
        time: response.time
      }
    })
  );
});

connection.on("TableListReleased", (response) => {
  console.log("TableListReleased received:", response);
  document.dispatchEvent(
    new CustomEvent("tableListStatusChanged", {
      detail: {
        barId: response.barId,
        date: response.date,
        time: response.time,
        tables: response.table.map(t => ({
          tableId: t.tableId,
          isHeld: false,
          holderId: null,
          accountId: null,
          status: 1,
          date: null,
          time: null
        }))
      }
    })
  );
});

// Export các hàm gửi SignalR
export const releaseTableSignalR = async (data) => {
  try {
    await hubConnection.invoke("ReleaseTable", data);
  } catch (error) {
    console.error("Error in releaseTableSignalR:", error);
  }
};

export const releaseTableListSignalR = async (data) => {
  try {
    await hubConnection.invoke("ReleaseListTablee", data);
  } catch (error) {
    console.error("Error in releaseTableListSignalR:", error);
  }
};
