import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BooksService } from './services/books.service';
import { Book } from './models/books';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  books: Book[] = [];
  loading = false;
  error = '';

  title = '';
  author = '';
  genre = '';
  publishedYear: number | null = null;

  search = '';
  genreFilter = '';

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.error = '';

    this.booksService.getAll(this.search, this.genreFilter).subscribe({
      next: (data) => {
        this.books = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Could not load books. Check backend and CORS.';
        this.loading = false;
      }
    });
  }

  createBook(): void {
    this.error = '';

    if (!this.title.trim() || !this.author.trim()) {
      this.error = 'Title and Author are required.';
      return;
    }

    const payload = {
      title: this.title.trim(),
      author: this.author.trim(),
      genre: this.genre.trim() ? this.genre.trim() : null,
      publishedYear: this.publishedYear
    };

    this.booksService.create(payload).subscribe({
      next: () => {
        this.title = '';
        this.author = '';
        this.genre = '';
        this.publishedYear = null;
        this.loadBooks();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to create book.';
      }
    });
  }

  deleteBook(id: number): void {
    this.booksService.delete(id).subscribe({
      next: () => this.loadBooks(),
      error: (err) => {
        console.error(err);
        this.error = 'Failed to delete book.';
      }
    });
  }
}
