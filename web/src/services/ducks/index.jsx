import Immutable from 'seamless-immutable'
import { notify } from 'react-notify-toast'
import * as UserAction from './action'


const store = Immutable({
  login: false,
  fetching: false,
  openedBook: null,
  adminMod: false,
  allAuthors: [],
  allGenres: [],
  likedBooksIds: [],
  allBooks: [],
  users: [],
  searchedBooks: []
})

const rootReducer = (state = store, action) => {

  switch (action.type) {
    // Toggle Admin Mod
    case UserAction.ADMIN_MOD_ACTIVATED:
      return state.merge({adminMod: action.payload})
    // Load Users
    case UserAction.FETCH_USERS_REQUEST:
      return state.merge({ fetching: true, users: [], error: null })
    case UserAction.FETCH_USERS_FAILURE:
      notify.show(action.payload, 'error', 1000)
      return state.merge({ error: action.payload, fetching: false })
    case UserAction.FETCH_USER_SUCCESS:
      return state.merge({ fetching: false, users: action.payload })
    // Login
    case UserAction.SET_CURRENT_USER:
      return state.merge({ authorizedUser: action.payload, likedBooksIds: action.payload.likedBooksIds, fetching: false, login: true, allBooks: action.payload.books })
    case UserAction.LOGGOUT_USER:
      notify.show('Logout success', 'success', 1000)
      return state.merge({ login: action.payload, authorizedUser: null })
    // Action Search Book
    case UserAction.FETCH_SEARCH_REQUEST:
      return state.merge({ fetching: true, searchedBooks: [], error: null })
    case UserAction.SUCCESS_SEARCH_BOOKS:
      notify.show('Search success', 'success', 1000)
      return state.merge({ searchedBooks: action.payload, fetching: false })
    case UserAction.ERROR_SEARCH_BOOKS:
      notify.show(action.payload, 'error', 1000)
      return state.merge({ fetching: false, error: action.payload })
    // Send Comment
    case UserAction.SEND_COMMENT_SUCCESS:
      notify.show('Comment successfully add and will shown when admin approve it', 'success', 1000)
      return state
    case UserAction.ERROR_SEND_COMMENT:
      notify.show(action.payload, 'error', 1000)
      return state.merge({ error: action.payload })
    // Load User
    case UserAction.OPENED_USER_IS_LOGINED_USER:
      return state.merge({ openedUser: Object.assign({}, state.authorizedUser) })
    case UserAction.USER_OPEN_REQUEST:
      return state.merge({ fetching: true, openedUser: null })
    case UserAction.USER_OPEN_SECCESS:
      return state.merge({ fetching: false, openedUser: action.payload, allBooks: state.allBooks.map(book => book.id === action.payload.books.id ? action.payload.book : book) })
    case UserAction.USER_OPEN_ERROR:
      notify.show(action.payload, 'error', 1000)
      return state.merge({ fetching: false, error: action.payload })
    // Cread Book
    case UserAction.BOOK_CREATED_REQUEST:
      return state.merge({ fetching: true })

    case UserAction.BOOK_CREATED_SUCCESS:
      notify.show('Book created', 'success', 1500)
      return state.merge({ fetching: false })
    case UserAction.BOOK_CREATED_ERROR:
      notify.show(action.payload, 'error', 1000)
      return state.merge({ error: action.payload, fetching: false })
    // Load Book
    case UserAction.BOOK_FETCH_REQUEST:
      return state.merge({ fetching: true, openedBook: null })
    case UserAction.BOOK_FETCH_SUCCESS:
      notify.show("Book open", 'success', 1500)
      return state.merge({ fetching: false, openedBook: action.payload })
    case UserAction.BOOK_FETCH_ERROR:
      notify.show(action.payload, 'error', 1000)
      return state.merge({ fetching: false, error: action.payload })
    // Load Books
    case UserAction.BOOKS_FETCH_REQUEST:
      return state.merge({ fetching: true })
    case UserAction.BOOKS_FETCH_SUCCESS:
      notify.show('Books get', 'success', 1000)
      return state.merge({ allBooks: action.payload, fetching: false })
    case UserAction.BOOKS_FETCH_ERROR:
      notify.show(action.payload, 'error', 1000)
      return state.merge({ error: action.payload })
    // Action add to collection books
    case UserAction.BOOK_ADD_TO_COLLECTION_SUCCESS:
      notify.show("Successfully added", 'success', 1500)
      return state.merge({ authorizedUser: action.payload, likedBooksIds: action.payload.likedBooksIds })
    case UserAction.BOOK_ADD_TO_COLLECTION_ERROR:
      notify.show(action.payload, 'error', 1500)
      return state.merge({ error: action.payload })
    // Action remove from collection books
    case UserAction.BOOK_REMOVE_FROM_COLLECTION_SUCCESS:
      notify.show("Successfully removed", 'success', 1500)
      return state.merge({ authorizedUser: action.payload, likedBooksIds: action.payload.likedBooksIds })
    case UserAction.BOOK_REMOVE_FROM_COLLECTION_ERROR:
      notify.show(action.payload, 'error', 1500)
      return state.merge({ error: action.payload })
    // Load Authors
    case UserAction.AUTHORS_FETCH_SUCCESS:
      return state.merge({ allAuthors: action.payload })
    case UserAction.AUTHORS_FETCH_ERROR:
      notify.show(action.payload, 'error', 1500)
      return state.merge({ error: action.payload })
    // Load Genres
    case UserAction.GENRES_FETCH_SUCCESS:
      return state.merge({ allGenres: action.payload })
    case UserAction.GENRES_FETCH_ERROR:
      notify.show(action.payload, 'error', 1500)
      return state.merge({ error: action.payload })
    // Action Like Book
    case UserAction.LIKE_BOOK_SUCCESS:
      return state.merge({
        allBooks: state.allBooks.map(book => book.id === action.payload.id ? Object.assign({}, book, { rating: action.payload.count }) : book),
        likedBooksIds: state.likedBooksIds.includes(action.payload.id)
          ? state.likedBooksIds.filter(i => i !== action.payload.id) : state.likedBooksIds.concat(action.payload.id),
        openedUser: Object.assign({}, state.openedUser,
          { books: state.openedUser.books.map(b => b.id === action.payload.id ? Object.assign({}, b, { rating: action.payload.count }) : b) }),
        authorizedUser: Object.assign({}, state.authorizedUser,
          { books: state.authorizedUser.books.map(b => b.id === action.payload.id ? Object.assign({}, b, { rating: action.payload.count }) : b) }),
        openedBook: Object.assign({}, state.openedBook, { rating: action.payload.count })
      })
    case UserAction.AVATAR_CHANGE_SUCCESS:
      return state.merge({ authorizedUser: Object.assign({}, state.authorizedUser, { avatar: action.payload }) })



// Admin case

      


    default:
      return state
  }
}

export default rootReducer
