import { useEffect, useState } from "react";
import { Container, Row, Col, Button, ButtonGroup, ToggleButton } from "react-bootstrap";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { SkeletonTheme } from "react-loading-skeleton";
import { CSSTransition } from "react-transition-group";
import LoadingComponent from "./LoadingComponent";

function SearchResultsPage ({search, setSearch}) {
    const [resultList,setResultList] = useState(null)
    const [totalResults, setTotalResults] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [error, setError] = useState('')

    const history = useHistory();
    const query = new URLSearchParams(useLocation().search)
    const queryText = query.get('query')
    const queryPage = query.get('page')

    const changePage = (dir) => {
        window.scrollTo(0,0)
        if(dir === 'beg') {
            history.push(`/search?query=${queryText}&page=1`)
        }
        if(dir === 'prev') {
            history.push(`/search?query=${queryText}&page=${Number(queryPage) - 1}`)
        }
        if(dir === 'next') {
            history.push(`/search?query=${queryText}&page=${Number(queryPage) + 1}`)
        }
        if(dir==='last') {
            history.push(`/search?query=${queryText}&page=${totalPages}`)
        }
    }

    
    useEffect(() => {
        window.scrollTo(0,0)
        setResultList(null)
        setError('')
        if(queryText) {
            fetch(`https://api.themoviedb.org/3/search/${search}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${queryText}&page=${queryPage}&include_adult=false`)
                .then(res => {
                    if(res.ok)
                        return res.json()
                    else throw new Error("Server down")
                })
                .then(data => {
                    setTotalResults(data.total_results)
                    setTotalPages(data.total_pages)
                    if (data.total_pages < queryPage && data.total_results)
                        history.push(`/search?query=${queryText}&page=1`)
                    else if(search === 'person') {
                        const filteredResults = data.results?.map((person) => ({
                            id:person.id,
                            name:person.name,
                            imgUrl: person.profile_path ? `https://image.tmdb.org/t/p/w185/${person.profile_path}` : 'https://static.stayjapan.com/assets/user_no_photo-4896a2d64d70a002deec3046d0b6ea6e7f01628781493566c95a02361524af97.png' ,
                            department: person.known_for_department
                        }))
                        setResultList(filteredResults)
                    }
                    else {
                        const filteredResults = data.results?.map((movie) => ({
                            id: movie.id,
                            title: movie.title,
                            description: movie.overview,
                            imgUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w342/${movie.poster_path}` : 'https://faculty.eng.ufl.edu/dobson-lab/wp-content/uploads/sites/88/2015/11/img-placeholder.png',
                            releaseDate: movie.release_date? new Date(movie.release_date).toLocaleDateString('en-UK', {year: 'numeric'}) :null,
                            rating:movie.vote_average
                        }))
                        setResultList(filteredResults)
                    }
                })
                .catch(err => setError(err.message))
            }
    },[queryText, queryPage, search, history])

    const resultCards = resultList ? search==='movie' ? resultList.map(movie => {
        return(
            <Col xs={6} sm={6} md={4} lg={3} className='p-sm-3 p-2 text-center' key={movie.id}>
               <Link to={`/movie/${movie.id}`}>
                   <div className='movie-card'>
                        <div className='movie-card-header'>
                            <h5 className='mx-2'>{movie.title}</h5>
                            <div style={{display:'flex', justifyContent:'space-between', margin:'5%',alignItems:'center'}}>
                                <span>⭐ {movie.rating || 'NR'}</span>
                                <span className='ml-2' style={{color:'lightgray'}}>{movie.releaseDate || ''}</span>
                            </div>
                        </div>
                        <img src={movie.imgUrl} alt='poster' height='379px' width='253px'/>
                   </div>
               </Link>
            </Col>
        )
    }) : resultList.map(person => {
        return(
            <Col xs={6} sm={4} md={3} lg={2} className='p-sm-3 p-2' key={person.id}>
               <Link to={`/cast/${person.id}`} style={{textDecoration:'none'}}>
                   <div className='person-card'>
                        <img src={person.imgUrl} alt='poster'/>
                        <div className='person-card-details'>
                            <h5>{person.name}</h5>
                            <h6 className='font-italic'>{person.department || ''}</h6>
                        </div>
                   </div>
               </Link>
            </Col>
        )
    }) : null

    function handleChange(e) {
        setResultList(null)
        setSearch(e.target.value)
    }

    if(queryText)
        return(
            <SkeletonTheme color="#505050" highlightColor="#303030">
                <Container style={{minHeight:'180vh', display:'flex', flexDirection:'column'}}>
                    <div className='feed-page-header text-center mt-5'>
                        <h1>Search Results</h1>
                        <div className='search-type'>
                            <ButtonGroup toggle>
                                <ToggleButton id="movie" checked={search === 'movie'} value='movie' onChange={(e) => handleChange(e)} type="radio" >
                                    Movies
                                </ToggleButton>
                                <ToggleButton id="person" checked={search === 'person'} value='person' onChange={(e) => handleChange(e)} type="radio" >
                                    People
                                </ToggleButton>
                            </ButtonGroup>
                        </div>
                        <h6 className='font-weight-light text-light'>{totalResults} matches found</h6>
                    </div>
                    <div style={{flexGrow:'1', display:'flex', flexDirection:'column'}}>
                        {totalPages > 1? <div className='text-center mb-4'>
                            <ButtonGroup>
                                <Button variant="warning" disabled={queryPage <= '1'}  onClick={() => changePage('beg')}><i className='fa fa-angle-double-left'></i></Button>
                                <Button variant="warning" disabled={queryPage <= '1'}  onClick={() => changePage('prev')}><i className='fa fa-angle-left'></i></Button>
                                <div className='page-number'><p className='mb-0'>{queryPage}</p></div>
                                <Button variant="warning" disabled={queryPage >= totalPages} onClick={() => changePage('next')}><i className='fa fa-angle-right'></i></Button>
                                <Button variant="warning" disabled={queryPage >= totalPages} onClick={() => changePage('last')}><i className='fa fa-angle-double-right'></i></Button>
                            </ButtonGroup>
                        </div> : null}
                        <CSSTransition in={Boolean(resultCards)} timeout={400} classNames='movie-cards'>
                            <Row className='mb-5 justify-content-center'>
                                { error? <h4 className='mx-auto my-5 text-muted text-center' style={{height:'50vh'}}>{error}<br />Please try again later.</h4>
                                : resultCards? resultCards.length ? resultCards 
                                : <h4 className='mx-auto my-5 text-muted' style={{height:'50vh'}}>No results</h4>
                                : <LoadingComponent page="feed" />
                                }
                            </Row>
                        </CSSTransition>
                        {totalPages > 1? <div className='text-center mb-5 mt-auto'>
                            <ButtonGroup>
                                <Button variant="warning" disabled={queryPage <= '1'}  onClick={() => changePage('beg')}><i className='fa fa-angle-double-left'></i></Button>
                                <Button variant="warning" disabled={queryPage <= '1'}  onClick={() => changePage('prev')}><i className='fa fa-angle-left'></i></Button>
                                <div className='page-number'><p className='mb-0'>{queryPage}</p></div>
                                <Button variant="warning" disabled={queryPage >= totalPages} onClick={() => changePage('next')}><i className='fa fa-angle-right'></i></Button>
                                <Button variant="warning" disabled={queryPage >= totalPages} onClick={() => changePage('last')}><i className='fa fa-angle-double-right'></i></Button>
                            </ButtonGroup>
                        </div> : null}
                    </div>
                </Container>
            </SkeletonTheme>
        )
    return(
        <div style={{minHeight:'80vh',display:'flex',alignItems:'center', justifyContent:'center'}}>
            <h3 className="text-center text-muted">Search for a movie using the search bar above!</h3>
        </div>
    )
}

export default SearchResultsPage