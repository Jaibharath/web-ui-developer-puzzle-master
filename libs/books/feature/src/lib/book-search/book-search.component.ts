import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { removeFromReadingList, getReadingList } from '@tmo/books/data-access';
import { ReadingListItem } from '@tmo/shared/models';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit {
  books: ReadingListBook[];
  readingList$ = this.store.select(getReadingList);
  itemList: ReadingListItem[];

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.readingList$.subscribe(
      itemList => {
        this.itemList = itemList;
      }
    )
  }

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.store.select(getAllBooks).subscribe(books => {
      this.books = books;
    });
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  actionConfirmation = (msg, func, data) => {
    const snackBarRef = this.snackBar.open(msg, 'Undo');

    snackBarRef.onAction().subscribe(() => {
      console.log('Undo');
      func(data);
    });
  }

  removeFromReadingList = (data) => {
    const item = data[data.length - 1];
    this.store.dispatch(removeFromReadingList({ item }));
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
    this.actionConfirmation(
      'Adding to reading list '+book.title, 
      this.removeFromReadingList, 
      this.itemList
    )
  }

  searchExample = () => {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks = () => {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }
}
