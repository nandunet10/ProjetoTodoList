import axios from "axios";

const Api = axios.create({
  baseURL: "https://localhost:44393/api/TodoItems",
});

export default Api;
