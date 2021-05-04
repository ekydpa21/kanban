import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Sidebar />
        <Route exact path="/">
          <Redirect to="/v1" />
        </Route>
        <Route path="/v1" component={Home} />
      </Router>
    </div>
  );
}

export default App;
