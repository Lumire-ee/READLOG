import { useState } from "react";
import { searchCombinedBooks } from "./api/combinedBooks";

function App() {
  const [query, setQuery] = useState("");
  interface Book {
    image: string;
    title: string;
    author: string;
    publisher: string;
  }

  const [books, setBooks] = useState<Book[]>([]);

  const handleSearch = async () => {
    console.log("검색 시작:", query);
    const results = await searchCombinedBooks(query);
    console.log("최종 결과:", results);
    setBooks(results);
  };

  return (
    <div className="p-4">
      <input
        className="border p-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="책 제목 검색"
      />
      <button
        className="ml-2 p-2 bg-blue-500 text-white"
        onClick={handleSearch}
      >
        검색
      </button>

      <ul className="mt-4">
        {books.map((book, idx) => (
          <li key={idx} className="border-b py-2 flex gap-4">
            <img src={book.image} alt={book.title} className="w-16 h-24" />
            <div>
              <div className="font-bold">{book.title}</div>
              <div>{book.author}</div>
              <div className="text-sm text-gray-500">{book.publisher}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
