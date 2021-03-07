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

export function apiSearch(key) {
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

// Book
export function apiQueryBooks() {
    const query = `
        query Books {
        books {
            id
            inBookshelf
            name
            authorName
            coverUrl
            summary
            contentChanged
            bookSource
            readingChapter {
                index
                name
            }
        }
        }`;
    return graphql(query);
}

export function apiDeleteBook(bookSourceId) {
    const query = `
        mutation DeleteBook($id: ID!) {
            deleteBook(id: $id)
        }`;
    const variables = {
        id: bookSourceId,
    };
    return graphql(query, variables);
}

export function apiMoveUpBook(bookId) {
    const query = `
        mutation MoveUpBook($id: ID!) {
            moveUpBook(id: $id)
        }`;
    const variables = {
        id: bookId,
    };
    return graphql(query, variables);
}

export function apiMoveDownBook(bookId) {
    const query = `
        mutation MoveDownBook($id: ID!) {
            moveDownBook(id: $id)
        }`;
    const variables = {
        id: bookId,
    };
    return graphql(query, variables);
}

export function apiQueryBook(bookInfo) {
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

export function apiReverseOrderBook(bookId, reverse) {
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

export function apiAddBookToBookShelf(bookId) {
    const query = `
        mutation AddBookToBookShelf($id: ID!) {
            addBookToBookShelf(id: $id)
        }`;
    const variables = {
        id: bookId,
    };
    return graphql(query, variables);
}

// BookSource
export function apiQueryBookSources() {
    const query = `
        query BookSources {
            bookSources {
                id name url enableSearch
            } 
        }`;
    return graphql(query);
}

export function apiCreateBookSource(payload) {
    const query = `
        mutation CreateBookSource($downloadUrl: String!) {
            createBookSource(downloadUrl: $downloadUrl) {
                id name url version enableSearch
            }
        }`;
    return graphql(query, payload);
}

export function apiDeleteBookSource(payload) {
    const query = `
        mutation DeleteBookSource($id: ID!) {
            deleteBookSource(id: $id)
        }`;
    return graphql(query, payload);
}

export function apiMoveUpBookSource(payload) {
    const query = `
        mutation MoveUpBookSource($id: ID!) {
            moveUpBookSource(id: $id)
        }`;
    return graphql(query, payload);
}

export function apiMoveDownBookSource(payload) {
    const query = `
        mutation MoveDownBookSource($id: ID!) {
            moveDownBookSource(id: $id)
        }`;
    return graphql(query, payload);
}

export function apiEnableBookSource(payload) {
    const query = `
        mutation EnableBookSource($id: ID!, $value: Boolean) {
            enableSearchBookSource(id: $id, value: $value)  
        }`;
    return graphql(query, payload);
}

export function apiLogin(user) {
    return axios.post(`${origin}/users/login`, user);
}

export function apiRegister(user) {
    return axios.post(`${origin}/users/register`, user);
}

export function apiChangePassword(user) {
    return axios.post(`${origin}/users/changepassword`, user);
}

function graphql(query, variables) {
    const payload = {
        query,
        variables
    };

    return axios.post(`${origin}/graphql`, JSON.stringify(payload), {
        headers: {'Content-Type': 'application/json'}
    });
}

export function apiVersion() {
    return axios.get(`${origin}/version`);
}

export function apiQueryBookChapter(bookId, bookChapterIndex, read) {
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

export function apiNotifyReadBookChapter(bookId, bookChapterIndex) {
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
