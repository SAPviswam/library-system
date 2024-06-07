namespace library;

entity Book {
    key ID                : UUID;
        ISBN              : String;
        title             : String;
        author            : String;
        quantity          : Integer;
        availableQuantity : Integer;
        genre             : String;
        loans             : Composition of many Loan
                                on loans.book = $self;
        user              : Composition of many User
                                on user.book = $self;
        issueBooks        : Association to many Issuebooks
                                on issueBooks.book = $self;
}

entity User {
    key ID       : UUID;
        role     : String enum {
            Admin;
            User
        };
        username : String;
        email    : String;
        password : String;
        loans    : Composition of many Loan
                       on loans.user = $self;
        book     : Association to Book;

}

entity Loan {
    key ID        : UUID;
        issueDate : DateTime;
        dueDate   : DateTime;
        status    : String enum {
            active;
            returned;
            overdue
        };
        user      : Association to User;
        book      : Association to Book;
}

entity Issuebooks {
    key ID                : UUID;
        ISBNno            : String;
        users             : String;
        titles            : String;
        reservedDate      : String;
        AvailableQuantity : Integer;
        book              : Association to Book;
}
