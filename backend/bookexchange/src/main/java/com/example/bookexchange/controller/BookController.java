package com.example.bookexchange.controller;

import com.example.bookexchange.model.Book;
import com.example.bookexchange.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Optional<Book> book = bookService.getBookById(id);
        return book.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Get all books uploaded by a specific user (by ownerEmail)
    @GetMapping("/user/{email}")
    public ResponseEntity<List<Book>> getBooksByUser(@PathVariable String email) {
        List<Book> books = bookService.getBooksByOwnerEmail(email);
        return books.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(books);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Book> addBook(
            @RequestParam("title") String title,
            @RequestParam("author") String author,
            @RequestParam("category") String category,
            @RequestParam("condition") String condition,
            @RequestParam("type") String type,
            @RequestParam("price") String price,
            @RequestParam("owner") String owner,
            @RequestParam("ownerEmail") String ownerEmail,
            @RequestParam(value = "ownerPhone", required = false) String ownerPhone,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) throws IOException {

        String imageUrl = null;

        if (image != null && !image.isEmpty()) {
            // ✅ Ensure uploads directory is in your project root (not in Tomcat temp)
            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            image.transferTo(filePath.toFile());

            // ✅ Use backend base URL for correct image path
            imageUrl = "http://localhost:8081/uploads/" + fileName;
        }

        Book book = new Book();
        book.setTitle(title);
        book.setAuthor(author);
        book.setCategory(category);
        book.setCondition(condition);
        book.setType(type);
        book.setPrice(price);
        book.setOwner(owner);
        book.setOwnerEmail(ownerEmail);
        book.setOwnerPhone(ownerPhone);
        book.setImageURL(imageUrl);

        Book savedBook = bookService.saveBook(book);
        return ResponseEntity.ok(savedBook);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book updatedBook) {
        Optional<Book> book = bookService.updateBook(id, updatedBook);
        return book.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (bookService.deleteBook(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
