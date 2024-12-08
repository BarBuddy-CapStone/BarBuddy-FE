import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const HUB_URL = `${BASE_URL}bookingHub`;

// Tạo một event emitter để quản lý các sự kiện
const eventEmitter = new EventTarget();

const connection = new signalR.HubConnectionBuilder()
  .withUrl(HUB_URL, {
    skipNegotiation: false,
    transport: signalR.HttpTransportType.WebSockets,
    accessTokenFactory: () => {
      return Cookies.get("authToken");
    },
  })
  .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
  .configureLogging(signalR.LogLevel.Information)
  .build();

// Theo dõi trạng thái kết nối
connection.onreconnecting((error) => {
  //console.log('SignalR Reconnecting:', error);
  eventEmitter.dispatchEvent(
    new CustomEvent("connectionStateChanged", {
      detail: { state: "reconnecting", error },
    })
  );
});

connection.onreconnected((connectionId) => {
  //console.log("SignalR Reconnected:", connectionId);
  eventEmitter.dispatchEvent(
    new CustomEvent("connectionStateChanged", {
      detail: { state: "connected", connectionId },
    })
  );
});

connection.onclose((error) => {
  //console.log("SignalR Connection closed:", error);
  eventEmitter.dispatchEvent(
    new CustomEvent("connectionStateChanged", {
      detail: { state: "disconnected", error },
    })
  );
});

// Khởi tạo kết nối với retry logic
async function startConnection() {
  try {
    if (connection.state === "Disconnected") {
      await connection.start();
      //console.log("SignalR Connected successfully");
      return true;
    }
    return connection.state === "Connected";
  } catch (err) {
    console.error("SignalR Connection Error:", err);
    return false;
  }
}

// Đảm bảo kết nối trước khi gửi message
async function ensureConnection() {
  if (connection.state === "Connected") return true;
  return await startConnection();
}

// Xử lý các sự kiện từ server
connection.on("TableHoId", (response) => {
  //console.log("TableHoId received:", response);
  document.dispatchEvent(
    new CustomEvent("tableStatusChanged", {
      detail: {
        tableId: response.tableId,
        isHeld: true,
        holderId: response.accountId,
        accountId: response.accountId,
        status: 2,
        date: response.date,
        time: response.time,
      },
    })
  );
});

connection.on("TableReleased", (response) => {
  //console.log("TableReleased received:", response);
  document.dispatchEvent(
    new CustomEvent("tableStatusChanged", {
      detail: {
        tableId: response.tableId,
        isHeld: false,
        holderId: null,
        accountId: null,
        status: 1,
        date: response.date,
        time: response.time,
      },
    })
  );
});

connection.on("TableListReleased", (response) => {
  //console.log("TableListReleased received:", response);

  if (!response) {
    //console.error("Empty TableListReleased response");
    return;
  }

  try {
    // Tạo một bản ghi log chi tiết về response
    // console.log(
    //   "Raw TableListReleased response:",
    //   JSON.stringify(response, null, 2)
    // );

    // Xử lý response theo đúng format từ BE
    const processedTable = {
      tableId: response.tableId,
      time: response.time,
      status: 1,
      isHeld: false,
      holderId: null,
      accountId: null,
    };

    document.dispatchEvent(
      new CustomEvent("tableListStatusChanged", {
        detail: {
          barId: response.barId,
          date: response.date,
          time: response.time,
          accountId: response.accountId,
          tables: [processedTable], // Wrap single table in array
        },
      })
    );
  } catch (error) {
    console.error("Error processing TableListReleased:", error, response);
  }
});

// Export các hàm gửi SignalR
export const releaseTableSignalR = async (data) => {
  try {
    //console.log("Attempting releaseTableSignalR with data:", data);

    if (!data || !data.barId || !data.tableId || !data.date || !data.time) {
      console.error("Invalid data format for ReleaseTable:", data);
      return false;
    }

    const isConnected = await ensureConnection();
    if (!isConnected) {
      console.error("Failed to establish SignalR connection");
      return false;
    }

    const formattedData = {
      barId: data.barId,
      tableId: data.tableId,
      accountId: "00000000-0000-0000-0000-000000000000",
      date: data.date,
      time: data.time,
    };

    //console.log("Sending ReleaseTable with formatted data:", formattedData);

    try {
      await connection.invoke("ReleaseTable", formattedData);
      //console.log("ReleaseTable sent successfully");
      return true;
    } catch (invokeError) {
      console.error("Error invoking ReleaseTable:", invokeError);
      return false;
    }
  } catch (error) {
    console.error("Error in releaseTableSignalR:", error);
    return false;
  }
};

export const releaseTableListSignalR = async (data) => {
  try {
    //console.log("Attempting releaseTableListSignalR with data:", data);

    if (
      !data ||
      !data.barId ||
      !data.date ||
      !data.time ||
      !Array.isArray(data.table)
    ) {
      console.error("Invalid data format for ReleaseListTable:", data);
      return false;
    }

    const isConnected = await ensureConnection();
    if (!isConnected) return false;

    const formattedData = {
      barId: data.barId,
      date: data.date,
      time: data.time,
      accountId: "00000000-0000-0000-0000-000000000000",
      tableId: data.table[0].tableId,
    };

    //console.log("Sending ReleaseListTable with formatted data:", formattedData);

    try {
      await connection.invoke("ReleaseListTable", formattedData);
      //console.log("ReleaseListTable sent successfully");
      return true;
    } catch (invokeError) {
      console.error("Error invoking ReleaseListTable:", invokeError);
      return false;
    }
  } catch (error) {
    console.error("Error in releaseTableListSignalR:", error);
    return false;
  }
};

// Khởi động kết nối khi module được load
startConnection();

// Export connection và events
export const hubConnection = connection;
export const signalREvents = eventEmitter;

logger.info('WebSocket connected to', connection);
logger.info('Using HubProtocol json');
