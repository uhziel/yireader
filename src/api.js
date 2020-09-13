import axios from "axios";

export function search(key) {
    return axios.get(`http://192.168.31.203:8888/dev/debug/search?key=${key}`);
}
