import { useEffect, useState } from "react";
import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { useHistory, useLocation } from "react-router";
import { SkeletonTheme } from "react-loading-skeleton";
import LoadingComponent from "./LoadingComponent";

function SearchResultsPage (props) {
    const [movieList,setMovieList] = useState(null)
    const [totalResults, setTotalResults] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const history = useHistory();
    const query = new URLSearchParams(useLocation().search)
    const queryText = query.get('query')
    const queryPage = query.get('page')
    
    const dispMovie = (id) => {
        history.push(`/movie/${id}`)
    }

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
        if(queryText)
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${queryText}&page=${queryPage}&include_adult=false`)
                .then((res) => res.json())
                .then(data => {
                    const options = {year: 'numeric', month: 'long', day: 'numeric' }
                    const filteredMovies = data.results.map((movie) => ({
                        id: movie.id,
                        title: movie.original_title,
                        description: movie.overview,
                        imgUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w342/${movie.poster_path}` : 'https://faculty.eng.ufl.edu/dobson-lab/wp-content/uploads/sites/88/2015/11/img-placeholder.png',
                        releaseDate: movie.release_date? new Date(movie.release_date).toLocaleDateString('en-UK',options) :null,
                        rating:movie.vote_average
                    }))
                    setTotalResults(data.total_results)
                    setTotalPages(data.total_pages)
                    setMovieList(filteredMovies)
                })
                .catch(err => console.log(err))
    },[queryText, queryPage])

    const movieCards = movieList? movieList.map(movie => {
        return(
            <Col xs={6} sm={6} md={4} lg={3} className='p-sm-3 p-2 text-center' key={movie.id} onClick={() => dispMovie(movie.id)}>
               <div className='movie-card'>
                    <div className='movie-card-header'>
                        <h5 className='mx-2 my-auto'>{movie.title}</h5>
                        <div style={{display:'flex', justifyContent:'space-between', margin:'5%',alignItems:'center'}}>
                            <span>⭐ {movie.rating || 'NR'}</span>
                            <span className='ml-2' style={{color:'lightgray'}}>{movie.releaseDate || ''}</span>
                        </div>
                    </div>
                    <img src={movie.imgUrl} alt='poster'/>
               </div>
            </Col>
        )
    }) : <LoadingComponent page="feed" />

    if(queryText)
        return(
            <SkeletonTheme color="#505050" highlightColor="#303030">
                <Container style={{minHeight:'70vh'}}>
                    <div className='feed-page-header text-center m-5'>
                        <h1>Search Results</h1>
                        <h5 className='font-weight-light text-light'>{totalResults} matches found</h5>
                    </div>
                    <Row>
                        {!movieList ? movieCards : movieList.length ? movieCards : <h2 className='mx-auto my-5 text-muted' style={{height:'50vh'}}>No results</h2>}
                    </Row>
                    {totalPages? <div className='text-center my-4'>
                        <ButtonGroup>
                            <Button variant="warning" disabled={queryPage <= '1'}  onClick={() => changePage('beg')}><i className='fa fa-angle-double-left'></i></Button>
                            <Button variant="warning" disabled={queryPage <= '1'}  onClick={() => changePage('prev')}><i className='fa fa-angle-left'></i></Button>
                            <div className='page-number'><p className='mb-0'>{queryPage}</p></div>
                            <Button variant="warning" disabled={queryPage >= totalPages} onClick={() => changePage('next')}><i className='fa fa-angle-right'></i></Button>
                            <Button variant="warning" disabled={queryPage >= totalPages} onClick={() => changePage('last')}><i className='fa fa-angle-double-right'></i></Button>
                        </ButtonGroup>
                    </div> : null}
                </Container>
            </SkeletonTheme>
        )
    return(
        <div>
            <h3 className="mx-auto my-5 text-center">Search for a movie using the search bar above!</h3>
        </div>
    )
}

export default SearchResultsPage