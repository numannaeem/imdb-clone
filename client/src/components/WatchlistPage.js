import { useEffect, useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { CSSTransition } from 'react-transition-group'
import { useHistory } from "react-router";

function WatchlistPage(props) {

    const [movies,setMovies] = useState([])

    useEffect(() => {
        const movies = []
        Object.keys(localStorage) 
        .forEach((key) =>{ 
            if (key.substring(0,4) === 'mId:') {
                const movie = {id: key.substring(4), ...JSON.parse(localStorage.getItem(key))}
                movies.push(movie)
            } 
        }); 
        setMovies(movies)
    }, [])

    const history = useHistory();

    const dispMovie = (id) => {
        history.push(`/movie/${id}`)
    }

    const movieCards = movies?.map(movie => {
        return(
            <Col xs={6} sm={6} md={4} lg={3} className='p-sm-3 p-2 text-center' key={movie.id} onClick={() => dispMovie(movie.id)}>
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
            </Col>
        )
    })

    return(
        <Container className='pb-5'  style={{minHeight:'100vh'}}>
            <div className='feed-page-header text-center my-5'>
                <h2>My Watchlist</h2>
            </div>
            <CSSTransition in={Boolean(movieCards && movieCards.length)} timeout={400} classNames='movie-cards'>
                <Row className='mb-5'>
                    {movieCards && movieCards.length ? movieCards : <h3 className='text-center w-100 text-muted my-5 mx-2' style={{height:'55vh'}}>Go to a movie and click on "Add to watchlist" to see them here!</h3>}   
                </Row>
            </CSSTransition>
        </Container>
    )
}

export default WatchlistPage