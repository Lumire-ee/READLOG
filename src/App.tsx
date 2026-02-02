import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./features/auth/provider/AuthProvider";
import AppRouter from "./router";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen w-full bg-bg-base">
          <div className="min-h-screen flex flex-col">
            <main className="flex-1 flex justify-center items-center">
              <AppRouter />
            </main>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
