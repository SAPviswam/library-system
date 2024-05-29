namespace library;

entity Book {
    key ISBN              : UUID;
        title             : String;
        author            : String;
        quantity          : Integer;
        availableQuantity : Integer;
        genre             : String;
        loans             : Composition of many Loan
                                on loans.book = $self;
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
}

entity Loan {
    key ID        : UUID;
        issueDate : DateTime;
        dueDate   : DateTime;
        status    : String enum {active;returned;overdue};
        user      : Association to User;
        book      : Association to Book;
}
