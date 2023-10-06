import "./styles.css";
import { Book, BookInformation, Review, ReviewInformation, User } from "./lib/types";
import { getBooks, getUsers, getReviews } from "./lib/api";
import { useEffect, useState, FC } from "react";
import Card from "./Card";

// Техническое задание:
// Доработать приложение App, чтобы в отрисованном списке
// были реальные отзывы, автор книги и автор отзыва.
// Данные об отзывах и пользователях можно получить при помощи асинхронных
// функций getUsers, getReviews

// функция getBooks возвращает Promise<Book[]>
// функция getUsers возвращает Promise<User[]>
// функция getReviews возвращает Promise<Review[]>

// В объектах реализующих интерфейс Book указаны только uuid
// пользователей и обзоров

// // В объектах реализующих интерфейс BookInformation, ReviewInformation
// указана полная информация об пользователе и обзоре.


const toBookInformation = (book: Book, users: User[], reviews: Review[]): BookInformation => {
    const autorName = users.find(user => user.id === book.authorId);

    const infoAllReviews = reviews.map(review => toReviewInformation(review, users));
    const contentIdBook = infoAllReviews.filter(review => review.id === book.reviewIds[0]);

  return {
    id: book.id,
    name: book.name || "Книга без названия",
    author:  autorName || { id: "", name: "Неизвестный автор" },
    reviews: contentIdBook ? contentIdBook : [],
    description: book.description
  };
};

const toReviewInformation = (review: Review, users: User[]): ReviewInformation => {
    const userName = users.find(user => review.userId === user.id)

    return {
        id: review.id,
        user: userName || {id: "", name: ""},
        text: review.text,
    } 
} 


const App: FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const [fetchedBooks, fetchedUsers, fetchedReviews] = await Promise.all([
            getBooks(),
            getUsers(),
            getReviews(),
        ]);

        setBooks(fetchedBooks);
        setUsers(fetchedUsers);
        setReviews(fetchedReviews);
      } catch (error) {
        alert('Book not found')
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Мои книги:</h1>
      {isLoading && <div>Загрузка...</div>}
      {!isLoading &&
        books.map((b) => <Card key={b.id} book={toBookInformation(b, users, reviews)} />)}
    </div>
  );
};

export default App;
