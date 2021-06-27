import { useEffect, useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
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
        console.log(movies)
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
                    <img src={movie.imgUrl} alt='poster' height='300px' width='238px'/>
               </div>
            </Col>
        )
    })

    return(
        <Container>
                <div className='feed-page-header text-center my-5'>
                    <h1>My Watchlist</h1>
                </div>
                <Row className='mb-5'>
                    {movieCards && movieCards.length ? movieCards : <h2 className='text-center w-100 text-muted my-5 mx-2'  style={{height:'50vh'}}>Go to a movie and click on "Add to watchlist" to see them here!</h2>}   
                </Row>
            </Container>
    )
}

export default WatchlistPage