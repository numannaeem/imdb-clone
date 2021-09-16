import { useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import NavbarBlue from "./components/NavbarBlue";
import HomeComponent from "./components/HomeComponent";
import PopularPage from "./components/PopularPage";
import TopRatedPage from "./components/TopRatedPage";
import UpcomingPage from "./components/UpcomingPage";
import WatchlistPage from "./components/WatchlistPage";
import SearchResultsPage from "./components/SearchResultsPage";
import MovieComponent from "./components/MovieComponent";
import CastComponent from "./components/CastComponent";
import Footer from "./components/FooterComponent";
import "./App.css";

function App() {
  const [search, setSearch] = useState("movie");
  return (
    <BrowserRouter>
      <NavbarBlue />
      <Switch>
        <Route exact path="/" component={HomeComponent} />
        <Route exact path="/popular" component={() => <Redirect to="/popular/1" />} />
        <Route exact path="/top-rated" component={() => <Redirect to="/top-rated/1" />} />
        <Route exact path="/upcoming" component={() => <Redirect to="/upcoming/1" />} />
        <Route
          path="/popular/:page"
          component={({ match }) => <PopularPage page={match.params.page} />}
        />
        <Route
          path="/top-rated/:page"
          component={({ match }) => <TopRatedPage page={match.params.page} />}
        />
        <Route
          path="/upcoming/:page"
          component={({ match }) => <UpcomingPage page={match.params.page} />}
        />
        <Route
          path="/search"
          component={() => (
            <SearchResultsPage search={search} setSearch={(type) => setSearch(type)} />
          )}
        />
        <Route path="/watchlist" component={WatchlistPage} />
        <Route
          path="/movie/:id"
          component={({ match }) => <MovieComponent id={match.params.id} />}
        />
        <Route
          path="/cast/:id"
          component={({ match }) => <CastComponent id={match.params.id} />}
        />
        <Redirect to="/" />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
