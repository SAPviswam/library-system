using library as lib from '../db/data-model';

service CatalogService {
    entity Book       as projection on lib.Book;
    entity User       as projection on lib.User;
    entity Loan       as projection on lib.Loan;
    entity Issuebooks as projection on lib.Issuebooks;
}
