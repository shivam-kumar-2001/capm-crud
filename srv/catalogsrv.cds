using { db.booksdatamodelNamespace as myBooks } from '../db/booksdatamodel' ;

service BooksService {
    entity BooksSet as projection on myBooks.books;
}