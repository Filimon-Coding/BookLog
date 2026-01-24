import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BooksService } from './services/books.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  books: any[] = [];
  loading = false;
  error = '';

  // form fields
  title = '';
  author = '';
  genre = '';
  publishedYear: number | null = null;

  // filters
  search = '';
  genreFilter = '';

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.loading = true;
    this.error = '';

    this.booksService.getAll(this.search, this.genreFilter).subscribe({
      next: (data) => {
        this.books = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Could not load books.';
        this.loading = false;
      }
    });
  }

  createBook() {
    this.error = '';

    if (!this.title.trim()) { this.error = 'Title is required.'; return; }
    if (!this.author.trim()) { this.error = 'Author is required.'; return; }

    const payload = {
      title: this.title,
      author: this.author,
      genre: this.genre || null,
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
        this.error = err?.error?.message ?? 'Could not create book.';
      }
    });
  }

  deleteBook(id: number) {
    this.booksService.delete(id).subscribe({
      next: () => this.loadBooks(),
      error: () => this.error = 'Could not delete book.'
    });
  }
}
