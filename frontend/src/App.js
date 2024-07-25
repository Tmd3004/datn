import Footer from "./layouts/Footer/Footer";
import Header from "./layouts/Header/Header";
import Router from "./routes";


function App() {
  return (
    <div className="App">
      <Header />
      <Router />
      <Footer />
    </div>
  );
}

export default App;
