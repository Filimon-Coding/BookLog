import NavBar from "./components/NavBar";
import AppRouter from "./router/AppRouter";

export default function App() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <NavBar />
      <div style={{ marginTop: 16 }}>
        <AppRouter />
      </div>
    </div>
  );
}
