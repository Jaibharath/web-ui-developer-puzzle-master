import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { 
  getReadingList, 
  removeFromReadingList, 
  addToReadingList, 
  getAllBooks,
  ReadingListBook
} from '@tmo/books/data-access';
import { ReadingListItem, Book } from '@tmo/shared/models';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  books: ReadingListBook[];
  readingList$ = this.store.select(getReadingList);
  bookList$ = this.store.select(getAllBooks);
  itemList: ReadingListItem[];

  constructor(
    private readonly store: Store,
    private snackBar: MatSnackBar
    ) {
      this.readingList$.subscribe(
        itemList => {
          this.itemList = itemList;
        }
      );
      this.bookList$.subscribe(books => {
        this.books = books;
      });
  }

  actionConfirmation = (msg, func, data) => {
    const snackBarRef = this.snackBar.open(msg, 'Undo');

    snackBarRef.onAction().subscribe(() => {
      func(data);
    });
  }

  addBookToReadingList = (book: Book) => {
    this.store.dispatch(addToReadingList({ book }));
  }

  removeFromReadingList = (item) => {
    this.store.dispatch(removeFromReadingList({ item }));
    this.actionConfirmation(
      'Removing from reading list '+item.title, 
      this.addBookToReadingList, 
      item
    )
  }
}
