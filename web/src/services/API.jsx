import axios from 'axios'

export const getCookie = (name) => {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export const set_cookie = (name, value, date) => {
  let d = new Date()
  d.setTime(d.getTime() + date*60)
  let expires = "expires=" + d.toGMTString();
  document.cookie = name + '=' + value + ';' + expires + ';Path=/;';
}
export const delete_cookie = (name) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const AuthStr = 'Bearer '.concat(getCookie("key"));
export const DEFAULT_HTTP_HEADERS = {
  'Content-Type': 'application/json',
  "Authorization": AuthStr
}

export const validateStatus = (status) => {
  return status >= 200 && status < 300
}

export const client = axios.create({
  baseURL: 'http://localhost:8080',
  headers: DEFAULT_HTTP_HEADERS,
  validateStatus: validateStatus
})

export const clientForLogin = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { "Content-type": "application/x-www-form-urlencoded; charset=utf-8" },
  validateStatus: validateStatus
})

/*
 * API endpoint to fetch all user books.
 */
export const fetchBooks = () => {
  return client.get(`/v1/books`)
}

export const fetchAuthors = () => {
  return client.get('/v1/authors')
}

export const fetchUsers = () => {
  return client.get('/v1/users')
}

export const removeBookFromUser = (userId, bookId) => {
  return client.patch('/v1/users/' + userId + '/books/' + bookId)
}

export const test = (p) => {
  return client.get('/v1/users/findNames/' + p);
}

export const fetchUser = (id) => {
  return client.get('/v1/users/' + id)
}

export const fetchEmail = (email) => {
  return client.post('/v1/users/findEmail', email);
}
export const CreateAuthor = (name) => {
  return client.post('/v1/authors', name);
}

export const addBooksToUser = (books) => {
  return client.post('/v1/users/' + books.userId, books);
}

export const DeleteAuthor = (id) => {
  return client.delete('/v1/authors/' + id);
}

export const CreateBook = (book) => {
  return client.post('/v1/books', book);
}

export const DeleteBook = (id) => {
  return client.delete('/v1/books/' + id);
}

export const CreateUser = (user) => {
  return client.post('/v1/users', user);
}

export const DeleteUser = (id) => {
  return client.delete('/v1/users/' + id);
}

export const updateAuth = () => {
  clientForLogin.defaults.auth = { username: 'my-trusted-client', password: 'secret' }
}

export const LoginOuath = (email, password) => {
  var params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', email);
  params.append('password', password);
  updateAuth()
  return clientForLogin.post('oauth/token', params)
}

export const Login = (username, password) => {
  updateAuth(username, password)
  return client.get('/v1/users/login')
}

export const logout = () => {
  delete_cookie('key')
  client.defaults.auth = null
}

export const searchBooks = (searchQuery) => {
  return client.get('/v1/books/search/' + searchQuery)
}
