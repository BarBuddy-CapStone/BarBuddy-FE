import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAfxkCKcmqD9QPOwO8_hp-XoBPP3olTWgU",
    storageBucket: "barbuddy-b2026.appspot.com",
    AuthEmail: "barbuddy05924@gmail.com",
    AuthPassword: "123456"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };