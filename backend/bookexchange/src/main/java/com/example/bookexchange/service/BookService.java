//service/BookService.java//
package com.example.bookexchange.service;

import com.example.bookexchange.model.Book;
import com.example.bookexchange.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    public Optional<Book> updateBook(Long id, Book updatedBook) {
        return bookRepository.findById(id).map(existing -> {
            existing.setTitle(updatedBook.getTitle());
            existing.setAuthor(updatedBook.getAuthor());
            existing.setCategory(updatedBook.getCategory());
            existing.setCondition(updatedBook.getCondition());
            existing.setType(updatedBook.getType());
            existing.setPrice(updatedBook.getPrice());
            //existing.setDescription(updatedBook.getDescription());
            existing.setImageURL(updatedBook.getImageURL());
            return bookRepository.save(existing);
        });
    }

    public boolean deleteBook(Long id) {
        if (bookRepository.existsById(id)) {
            bookRepository.deleteById(id);
            return true;
        }
        return false;
    }
}