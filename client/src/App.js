import './App.css';
import PopularPage from './components/PopularPage';
import TopRatedPage from './components/TopRatedPage';
import UpcomingPage from './components/UpcomingPage';
import { BrowserRouter, Switch, Route, Redirect} from 'react-router-dom'
import MovieComponent from './components/MovieComponent';
import HomeComponent from './components/HomeComponent';
import SearchResultsPage from './components/SearchResultsPage';
import NavbarBlue from './components/NavbarBlue';
import Footer from './components/FooterComponent';
import CastComponent from './components/CastComponent';

function App() {

  return (
    <BrowserRouter>
      <NavbarBlue />
      <Switch>
        <Route path='/home' component={HomeComponent} />
        <Route exact path='/popular' component={() => <Redirect to='/popular/1' />} />
        <Route exact path='/top-rated' component={() => <Redirect to='/top-rated/1' />} />
        <Route exact path='/upcoming' component={() => <Redirect to='/upcoming/1' />} />
        <Route path='/popular/:page' component={({match}) => <PopularPage page={match.params.page} />} />
        <Route path='/top-rated/:page' component={({match}) => <TopRatedPage page={match.params.page} />} />
        <Route path='/upcoming/:page' component={({match}) => <UpcomingPage page={match.params.page} />} />
        <Route path='/search' component={() => <SearchResultsPage  />} />
        <Route path='/movie/:id' component={({match}) => <MovieComponent id={match.params.id} />} />
        <Route path='/cast/:id' component={({match}) => <CastComponent id={match.params.id} />} />
        <Redirect to='/home' />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
