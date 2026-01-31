import NavBar from "./components/Navbar";
import AppRouter from "./router/AppRouter";

export default function App() {
  return (
    <div>
      <NavBar />
      <main className="container main">
        <AppRouter />
      </main>
    </div>
  );
}
