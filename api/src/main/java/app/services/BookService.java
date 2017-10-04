package app.services;

import app.repository.AuthorRepository;
import app.rest.model.BookInfo;
import app.rest.model.CreateBookCommand;
import app.model.Author;
import app.model.Book;
import app.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.transaction.Transactional;
import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    public BookService(BookRepository bookRepository, AuthorRepository authorRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
    }

    public List<BookInfo> findAll() {
        return bookRepository.findAll().stream()
            .map(BookService::toBookInfo)
            .collect(Collectors.toList());
    }

    public BookInfo findOne(Long id) {
        return toBookInfo(bookRepository.findOne(id));
    }

    @Transactional
    public BookInfo save(CreateBookCommand book) {
        // Get existing authors
        List<Author> authors = book.getAuthorsIds().stream()
            .map(authorRepository::findOne)
            .collect(Collectors.toList());

        // Create new authors
        if (!CollectionUtils.isEmpty(book.getNewAuthors())) {
            authors.addAll(authorRepository.save(book.getNewAuthors().stream()
                .map(Author::new)
                .collect(Collectors.toList())));
        }

        Book newBook = new Book(book.getName(), book.getPublisher(), Date.valueOf("2017-03-01"));
        newBook.setAuthors(authors);
        return toBookInfo(bookRepository.save(newBook));
    }

    @Transactional
    public void delete(Long id) {
        bookRepository.delete(id);
    }

    @Transactional
    public void delete(Book book) {
        bookRepository.delete(book);
    }

    @Transactional
    public void deleteAll() {
        bookRepository.deleteAll();
    }

    public static BookInfo toBookInfo(Book book) {
        BookInfo bookInfo = new BookInfo(book.getId(), book.getName(), book.getPublisher(), book.getDatePublished());
        bookInfo.setAuthors(
            book.getAuthors().stream()
                .map(Author::getName)
                .collect(Collectors.toList())
        );
        return bookInfo;
    }
}
