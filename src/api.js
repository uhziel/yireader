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
                author {
                    name
                }
                summary
                coverUrl
                url
                bookSourceId
            }
        }`;
    const variables = {
        name: key
    };
    return graphql(query, variables);
}

export function book(bookInfo) {
    const query = `
        query Book($info: BookInfo!) {
            book(info: $info) {
                id name
                inBookshelf
                author {
                    name
                }
                coverUrl
                lastChapter
                status
                summary
                spine {
                    name
                    url
                    chapter
                }
            }
        }`;
    const variables = {
        info: bookInfo
    };
    return graphql(query, variables);
}

export function addBookToBookShelf(bookId) {
    const query = `
        mutation AddBookToBookShelf($id: ID!) {
            addBookToBookShelf(id: $id)
        }`;
    const variables = {
        id: bookId,
    };
    return graphql(query, variables);
}

export function createBook(bookInfo) {
    const query = `
        mutation CreateBook($info: BookInfo!) {
            createBook(info: $info) {
                id
                name
                author {
                    name
                }
                coverUrl
                summary
                url
                bookSource
            }
        }`;
    const variables = {
        info: bookInfo,
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
    book,
    createBook,
    detail,
    catalog,
    chapter,
    login,
    register,
    changePassword,
    graphql,
};
