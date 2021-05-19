import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import { GuardProvider, GuardedRoute } from "react-router-guards";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";

const requireLogin = (to, from, next) => {
  if (to.meta.auth) {
    if (localStorage.getItem("access_token")) {
      if (to.location.pathname === "/login") {
        next.redirect("/");
      } else {
        next();
      }
    } else {
      if (to.location.pathname === "/") {
        next.redirect("/login");
      } else if (to.location.pathname === "/register") {
        next.redirect("/register");
      }
      next.redirect("/login");
    }
  } else {
    next();
  }
};

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <GuardProvider guards={[requireLogin]}>
          <GuardedRoute exact path="/" meta={{ auth: true }}>
            <Redirect to="/home" />
          </GuardedRoute>
          <GuardedRoute path="/home" meta={{ auth: true }}>
            <Header />
            <Home />
          </GuardedRoute>
          <GuardedRoute path="/login" component={Login} meta={{ auth: true }} />
          <GuardedRoute
            path="/register"
            component={Register}
            meta={{ auth: true }}
          />
        </GuardProvider>
      </Router>
    </div>
  );
}

export default App;
