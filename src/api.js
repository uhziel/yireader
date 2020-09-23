import axios from "axios";

export function search(key) {
    return axios.get(`http://192.168.31.203:8888/dev/debug/search?key=${key}`);
}

export function detail(bookInfo) {
    return axios.post("http://192.168.31.203:8888/dev/debug/detail", bookInfo);
}

export function catalog(bookDetail) {
    return axios.post("http://192.168.31.203:8888/dev/debug/catalog", bookDetail);
}

export function chapter(chapterInfo) {
    return axios.post("http://192.168.31.203:8888/dev/debug/chapter", chapterInfo);
}

export default {
    search,
    detail,
    catalog,
    chapter
};
