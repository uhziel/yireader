import axios from "axios";

const origin = "";
//const origin = "http://192.168.0.114:8888/dev/debug";
//const origin = "http://192.168.31.203:8888/dev/debug";

export function search(key) {
    return axios.get(`${origin}/search?key=${key}`);
}

export function detail(bookInfo) {
    return axios.post(`${origin}/detail`, bookInfo);
}

export function catalog(bookDetail) {
    return axios.post(`${origin}/catalog`, bookDetail);
}

export function chapter(chapterInfo) {
    return axios.post(`${origin}/chapter`, chapterInfo);
}

export function booksources() {
    return axios.get(`${origin}/booksources`);
}

export default {
    search,
    detail,
    catalog,
    chapter,
    booksources
};
