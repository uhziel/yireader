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
                authorName
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
                authorName
                coverUrl
                lastChapter
                status
                summary
                reverseOrder
                readingChapter {
                    index
                    name
                }
                spine {
                    name
                }
            }
        }`;
    const variables = {
        info: bookInfo
    };
    return graphql(query, variables);
}

export function reverseOrderBook(bookId, reverse) {
    const query = `
        mutation ReverseOrderBook($id: ID!, $reverse: Boolean!) {
            reverseOrderBook(id: $id, reverse: $reverse)
        }`;
    const variables = {
        id: bookId,
        reverse: reverse,
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

export function version() {
    return axios.get(`${origin}/version`);
}

export function queryBookChapter(bookId, bookChapterIndex, read) {
    const query = `
    query BookChapter($info: BookChapterInfo!) {
      bookChapter(info: $info) {
        index
        name
        data
        prev {
          index
          name
        }
        next {
          index
          name
        }
      }
    }`;
  const variables = {
      info: {
        bookId,
        bookChapterIndex,
        read,
      }
  };
  return graphql(query, variables);
}

export function notifyReadBookChapter(bookId, bookChapterIndex) {
    const query = `
    query BookChapter($info: BookChapterInfo!) {
      bookChapter(info: $info) {
        index
      }
    }`;
  const variables = {
      info: {
        bookId,
        bookChapterIndex,
        read: true
      }
  };
  return graphql(query, variables);
}

export default {
    search,
    book,
    detail,
    catalog,
    chapter,
    login,
    register,
    changePassword,
    graphql,
};
