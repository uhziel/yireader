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
    const query = `
        query Search($name: String!) {
            search(name: $name) {
                name
                author
                summary
                cover
                detail
            }
        }`;
    const variables = {
        name: key
    };
    return graphql(query, variables);
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

export function login(user) {
    return axios.post(`${origin}/users/login`, user);
}

export function register(user) {
    return axios.post(`${origin}/users/register`, user);
}

export function changePassword(user) {
    return axios.post(`${origin}/users/changepassword`, user);
}

export function graphql(query, variables) {
    const payload = {
        query,
        variables
    };

    return axios.post(`${origin}/graphql`, JSON.stringify(payload), {
        headers: {'Content-Type': 'application/json'}
    });
}

export default {
    search,
    detail,
    catalog,
    chapter,
    login,
    register,
    changePassword,
    graphql,
};
