import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchPage from "./features/books/pages/SearchPage";
import SignupPage from "./features/auth/pages/SignupPage";
import LoginPage from "./features/auth/pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-bg-base">
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 flex justify-center items-center">
            <Routes>
              <Route path="/" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
