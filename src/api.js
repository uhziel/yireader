import axios from "axios";

const origin = "";
//const origin = "http://192.168.31.203:8888/dev/debug";

export function setAuthorizationHeader(value) {
    if (value) {
        axios.defaults.headers.common['Authorization'] = value;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
}

export function search(key) {
    return axios.post(`${origin}/search?key=${key}`);
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
    const query = `{ "query": "{ bookSources { name url } }"}`;
    return axios.post(`${origin}/graphql`, query, {
        headers: {'Content-Type': 'application/json'}
    });
}

export function login(user) {
    return axios.post(`${origin}/users/login`, user);
}

export function register(user) {
    return axios.post(`${origin}/users/register`, user);
}

export function changePassword(user) {
    return axios.post(`${origin}/users/changepassword`, user);
}

export default {
    search,
    detail,
    catalog,
    chapter,
    booksources,
    login,
    register,
    changePassword,
};
