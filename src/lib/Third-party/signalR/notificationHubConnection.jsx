import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Tạo event emitter để quản lý các sự kiện notification
const notificationEventEmitter = new EventTarget();

// Tạo connection builder cho notification hub
const createNotificationConnection = (accountId) => {
  if (!accountId) {
    console.error("AccountId is required for notification hub connection");
    return null;
  }

  const NOTIFICATION_HUB_URL = `${BASE_URL}notificationHub?accountId=${accountId}`;

  const connection = new signalR.HubConnectionBuilder()
    .withUrl(NOTIFICATION_HUB_URL, {
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
    //console.log("Notification Hub Reconnecting:", error);
    notificationEventEmitter.dispatchEvent(
      new CustomEvent("notificationConnectionStateChanged", {
        detail: { state: "reconnecting", error },
      })
    );
  });

  connection.onreconnected((connectionId) => {
    //console.log("Notification Hub Reconnected:", connectionId);
    notificationEventEmitter.dispatchEvent(
      new CustomEvent("notificationConnectionStateChanged", {
        detail: { state: "connected", connectionId },
      })
    );
  });

  connection.onclose((error) => {
    //console.log("Notification Hub Connection closed:", error);
    notificationEventEmitter.dispatchEvent(
      new CustomEvent("notificationConnectionStateChanged", {
        detail: { state: "disconnected", error },
      })
    );
  });

  // Listen cho sự kiện ReceiveNotification
  connection.on("ReceiveNotification", (notification) => {
    //console.log("Received notification:", notification);

    // Dispatch event để các component khác có thể lắng nghe
    document.dispatchEvent(
      new CustomEvent("notificationReceived", {
        detail: {
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          timestamp: notification.timestamp,
          mobileDeepLink: notification.mobileDeepLink,
          webDeepLink: notification.webDeepLink,
          imageUrl: notification.imageUrl,
          isRead: notification.isRead,
          barId: notification.barId,
          isPublic: notification.isPublic,
          readAt: notification.readAt,
        },
      })
    );
  });

  return connection;
};

// Khởi tạo kết nối với retry logic
const startNotificationConnection = async (connection) => {
  if (!connection) return false;

  try {
    if (connection.state === "Disconnected") {
      await connection.start();
      //console.log("Notification Hub Connected successfully");
      return true;
    }
    return connection.state === "Connected";
  } catch (err) {
    console.error("Notification Hub Connection Error:", err);
    return false;
  }
};

// Đảm bảo kết nối trước khi thực hiện các operation
const ensureNotificationConnection = async (connection) => {
  if (!connection) return false;
  if (connection.state === "Connected") return true;
  return await startNotificationConnection(connection);
};

export {
  createNotificationConnection,
  ensureNotificationConnection,
  notificationEventEmitter,
  startNotificationConnection,
};
