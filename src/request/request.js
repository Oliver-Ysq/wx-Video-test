import axios from "axios";

axios.defaults.withCredentials = true
let instance = axios.create({
    baseURL: "http://100.112.17.236:8081/",
    timeout: 120000
})

export default instance;