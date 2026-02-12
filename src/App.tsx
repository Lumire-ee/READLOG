import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./features/auth/provider/AuthProvider";
import AppRouter from "./router";
import { Toaster } from "./components/ui/sonner";
import BookDetailModalHost from "./features/books/components/BookDetailModalHost";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-center" />
          <BookDetailModalHost />
          <div className="bg-bg-base min-h-screen w-full">
            <div className="flex min-h-screen flex-col">
              <main className="flex flex-1 items-center justify-center">
                <AppRouter />
              </main>
            </div>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
