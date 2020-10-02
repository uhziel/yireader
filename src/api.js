import axios from "axios";

const origin = "http://192.168.0.114:8888";
//const origin = "http://192.168.31.203:8888";

export function search(key) {
    return axios.get(`${origin}/dev/debug/search?key=${key}`);
}

export function detail(bookInfo) {
    return axios.post(`${origin}/dev/debug/detail`, bookInfo);
}

export function catalog(bookDetail) {
    return axios.post(`${origin}/dev/debug/catalog`, bookDetail);
}

export function chapter(chapterInfo) {
    return axios.post(`${origin}/dev/debug/chapter`, chapterInfo);
}

export default {
    search,
    detail,
    catalog,
    chapter
};
