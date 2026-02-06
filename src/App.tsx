import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./features/auth/provider/AuthProvider";
import AppRouter from "./router";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="bg-bg-base min-h-screen w-full">
          <div className="flex min-h-screen flex-col">
            <main className="flex flex-1 items-center justify-center">
              <AppRouter />
            </main>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
