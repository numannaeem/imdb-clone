import { useRef, useState } from 'react';
import { Navbar, Nav, Form } from 'react-bootstrap';
import { useHistory, withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

function NavbarBlue(props) {

  const searchRef = useRef('')
  const history = useHistory();

  const [expanded, setExpanded] = useState(false)

  const search = (e,query) => {
    e.preventDefault()
    if(query) {
      setExpanded(false)
      history.push(`/search?query=${query}&page=1`);
    }
  }

  return (
    <Navbar className='navbar-blue' variant='dark' expand='md' sticky='top' expanded={expanded}>
      <Navbar.Brand href='/home'><span className='logo'>NuMDb</span></Navbar.Brand>
      <Navbar.Toggle onClick={() => setExpanded((prev) => !prev)} />
      <Navbar.Collapse id='navbar-main'>
        <Nav className='mr-auto'>
          <NavLink activeClassName="navbar-link-active" onClick={() => {if(expanded) setExpanded(false)}} className='navbar-link' to="/popular">Popular</NavLink>
          <NavLink activeClassName="navbar-link-active" onClick={() => {if(expanded) setExpanded(false)}} className='navbar-link' to="/top-rated">Top Rated</NavLink>
          <NavLink activeClassName="navbar-link-active" onClick={() => {if(expanded) setExpanded(false)}} className='navbar-link' to="/upcoming">Upcoming</NavLink>
          <NavLink activeClassName="navbar-link-active" onClick={() => {if(expanded) setExpanded(false)}} className='navbar-link' to="/watchlist">My Watchlist</NavLink>
        </Nav>
        <Form inline className='search-bar' onSubmit={(e) => search(e,searchRef.current.value)} style={{width:'fit-content'}}>
            <input className='search-bar-input' ref={searchRef} style={{width:'100%', padding:'6px 0 6px 9px'}} type='text' placeholder='Search away!'/>
            <button type='submit'><i className='fa fa-search' /></button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default withRouter(NavbarBlue)