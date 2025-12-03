import { useBookStore } from "./features/books/store/useBookSearchStore";

function App() {
  const {
    query,
    includeVariants,
    books,
    loading,
    error,
    setQuery,
    setIncludeVariants,
    search,
  } = useBookStore();

  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <input
          className="border p-2 flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="책 제목 검색"
        />
        <button
          className="p-2 bg-blue-500 text-white disabled:opacity-50"
          onClick={() => search()}
          disabled={loading}
        >
          {loading ? "검색 중..." : "검색"}
        </button>
        <label className="ml-2 inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={includeVariants}
            onChange={(e) => setIncludeVariants(e.target.checked)}
          />
          모든 판본 보기
        </label>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

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
