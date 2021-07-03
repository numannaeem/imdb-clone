import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from 'react-bootstrap'
import { withRouter } from "react-router";
import { SkeletonTheme } from "react-loading-skeleton";
import LoadingComponent from "./LoadingComponent";
import { AddButton, DeleteButton } from "./watchlistButtons";
import { languages } from '../shared/languages'
import YoutubeEmbed from "./YoutubeEmbed";

function MovieComponent({id, history}) {

    const [movie, setMovie] = useState(null)
    const [error,setError] = useState(null)
    const [inWatchlist, setInWatchlist] = useState(false)
    const [reviewFeedExpanded, setReviewFeedExpanded] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [seeMoreBtn, setSeeMoreBtn] = useState({
        reviewsPresent: false,
        heightOver300: false 
    });
    const reviewFeedRef = useRef(null)

    const dispCast = (id) => {
        history.push(`/cast/${id}`)
    }

    const dispMovie = (id) => {
        setMovie(null)
        history.push(`/movie/${id}`)
    }
    
    useEffect(() => {     
        window.scrollTo(0,0)
        setInWatchlist(Boolean(localStorage.getItem(`mId:${id}`)))
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&append_to_response=credits,reviews,videos,recommendations`)
            .then(res => {
                if(!res.ok)
                    throw new Error("Server error")
                else return res.json()
            })
            .then(data => {
                const options = {year: 'numeric', month: 'long', day: 'numeric' }
                const filteredMovie = {
                    title: data.title,
                    description: data.overview,
                    imdbUrl: data.homepage,
                    genres: data.genres?.map(genre => genre.name),
                    budget: data.budget,
                    releaseDate: data.release_date? new Date(data.release_date).toLocaleDateString('en-US',options) : null,
                    revenue: data.revenue,
                    runtime: data.runtime,
                    tagline: data.tagline,
                    rating: data.vote_average,
                    language: data.original_language,
                    voteCount: data.vote_count,
                    companies:data.production_companies?.slice(0,4).map(c => c.name),
                    imgUrl: data.poster_path ? `https://image.tmdb.org/t/p/w342${data.poster_path}` : 'https://faculty.eng.ufl.edu/dobson-lab/wp-content/uploads/sites/88/2015/11/img-placeholder.png',
                    backdropUrl: `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`,
                    cast: data.credits.cast?.slice(0,20).map(c =>  ({
                        id: c.id,
                        name: c.name, 
                        pictureUrl: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : 'https://static.stayjapan.com/assets/user_no_photo-4896a2d64d70a002deec3046d0b6ea6e7f01628781493566c95a02361524af97.png', 
                        character:c.character
                    })),
                    producers: data.credits.crew?.filter(c => c.job === "Producer").map(c => c.name),
                    directors: data.credits.crew?.filter(c => c.job === "Director").map(c => c.name),
                    reviews: data.reviews.results?.slice(0,3).map(r => ({
                        id:r.id,
                        content: r.content,
                        author: r.author_details.name || r.author_details.username,
                        rating: r.author_details.rating,
                        profileUrl: r.author_details.avatar_path? r.author_details.avatar_path.substring(0,5) !== '/http' ? `https://image.tmdb.org/t/p/w45${r.author_details.avatar_path}` : r.author_details.avatar_path.substring(1) :'https://static.stayjapan.com/assets/user_no_photo-4896a2d64d70a002deec3046d0b6ea6e7f01628781493566c95a02361524af97.png',
                        date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-US',options) : null
                    })),
                    videoUrls: data.videos.results?.filter(r => r.site === 'YouTube')?.map(v => ({key: v.key, name: v.name})),
                    recommendations: data.recommendations?.results?.map(m => ({
                        id: m.id,
                        title: m.title,
                        imgUrl: m.poster_path ? `https://image.tmdb.org/t/p/w342/${m.poster_path}` : 'https://faculty.eng.ufl.edu/dobson-lab/wp-content/uploads/sites/88/2015/11/img-placeholder.png',
                        rating: (Math.floor(m.vote_average*10))/10,
                        releaseDate: m.release_date? m.release_date.slice(0,4): null
                    }))
                }
                setMovie(filteredMovie)
                setCurrentVideo(0)
                setSeeMoreBtn((p) => ({heightOver300: p.heightOver300, reviewsPresent: filteredMovie.reviews.length > 0}))
            })
            .catch(err => {
                setError(err.message)
            })
    },[id])

    useEffect(() => {
        if (reviewFeedRef.current) { 
            setSeeMoreBtn(p => ({reviewsPresent:p.reviewsPresent, heightOver300: reviewFeedRef.current.clientHeight > 299}))
        }
        else {
            setSeeMoreBtn({
                heightOver300: true, reviewsPresent: true
            })
        }
    },[movie])

    if(error) {
        return(
            <h3 className='text-muted text-center' style={{margin:'15rem auto'}}>{error}<br />Try again</h3>
        )
    }

    if(movie) {
        const genres = movie.genres?.map(g => <p className='genre-pill' key={g}>{g}</p>)    
        const companies = movie.companies?.map((c,idx) => idx !== movie.companies.length - 1 ? c + ', ' : c)
        const producers = movie.producers?.map((p, idx) => idx !== movie.producers.length - 1 ? p + ', ' : p)
        const directors = movie.directors?.map((p, idx) => idx !== movie.directors.length - 1 ? p + ', ' : p)
        const reviews = movie.reviews?.map(r => {
            return(
                <div className='review-card' key={r.id}>
                    <div className='d-flex align-items-center'>
                        <img src={r.profileUrl} height='45px' width='45px' alt={r.author}/>
                        <div className='ml-2'>
                            <h6 className='mb-0'>{r.author}</h6>
                            <small className='font-weight-light mb-0'>{r.date}{r.rating? ' • ⭐'+ r.rating : null}</small>
                        </div>
                    </div>
                    <hr style={{borderColor:'gray'}} className='mt-1'/>
                    <p className='font-weight-light'>{r.content}</p>
                </div>
            )
        })
        const cast = movie.cast?.map(c => {
            return (
                <div className='cast-card' key={c.id} onClick={() => dispCast(c.id)}>
                    <img src={c.pictureUrl} alt='actor' />
                    <div className='px-2 pb-1 pt-2' style={{height:'max-content'}}>
                        <h5>{c.name}</h5>
                        <h6 className='font-weight-light'>as {c.character || '-'}</h6>
                    </div>
                </div>
            )
        })
        const recommendations = movie.recommendations?.map(m => {
            return(
                <div className='movie-card recommendation' key={m.id} onClick={() => dispMovie(m.id)}>
                    <div className='movie-card-header'>
                        <h5 className='mx-2'>{m.title}</h5>
                        <div style={{display:'flex', justifyContent:'space-between', margin:'5%',alignItems:'center'}}>
                            <span>⭐ {m.rating || 'NR'}</span>
                            <span className='ml-2' style={{color:'lightgray'}}>{m.releaseDate || ''}</span>
                        </div>
                    </div>
                    <img src={m.imgUrl} alt='poster' height='379px' width='253px'/>
               </div>
            )
        })
        const videos = movie.videoUrls?.map(v => {
            return(
                <div className='video mb-3' key={v.key}>
                    <YoutubeEmbed embedId={v.key} />
                </div>
            )
        })

        const changeVideo = (dir) => {
            if(dir === 'next') {
                if(currentVideo === movie.videoUrls.length - 1)
                    setCurrentVideo(0)
                else
                    setCurrentVideo(p => p+1)
                return;
            }
            if(dir === 'prev') {
                if(currentVideo === 0)
                    setCurrentVideo(movie.videoUrls.length - 1)
                else
                    setCurrentVideo(p => p-1)
                return;
            }
        }

        return(
            <div className='movie-page'>
                <div className='movie-page-header' style={{backgroundImage:'linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)),url('+ movie.backdropUrl + ')'}}>
                    <img src={movie.imgUrl} alt="movie poster" className='d-none d-md-block' height="512px" width="342px" />
                    <div className='header-details'>
                        <a href={movie.imdbUrl} title="Visit movie website">{movie.title}</a>
                        {movie.tagline && <h5 className='font-weight-light font-italic'>{movie.tagline}</h5>}
                        <div>{genres}</div>
                        <h5 className='my-2'>⭐{movie.rating || 'NR'}{movie.voteCount ? <small className='text-warning'> ({movie.voteCount} votes)</small> : null}</h5>
                        <p className='font-weight-bold' style={{color:'darkgray'}}>{languages[movie.language].name} • {movie.releaseDate || 'In Production'} {movie.runtime? `• ${movie.runtime} mins` : null}</p>
                        <div>
                            <b>Producer(s): </b>
                            <p>{producers && producers.length? producers : '-'}</p>
                            <b>Director(s): </b>
                            <p>{directors && directors.length? directors : '-'}</p>
                            <b>Production Companies: </b>
                            <p>{companies && companies.length? companies : '-'}</p>
                        </div>
                        <p>
                            <b>Estimated Revenue: </b>{movie.revenue ? '$'+movie.revenue.toLocaleString('en-UK') : '-'}
                        </p>
                        { inWatchlist ? <DeleteButton movieId={id} onClick={() => setInWatchlist(false)}/> 
                        : <AddButton onClick={() => setInWatchlist(true)} movieId={id} 
                            name={JSON.stringify({title:movie.title, rating:movie.rating, imgUrl:movie.imgUrl, releaseDate:movie.releaseDate?.substr(-4,4)})}
                        />}
                    </div>
                </div>
                <div className='movie-page-body'>
                    <Container>
                        <Row>
                            <Col xs className='mb-3'>
                                <h3 className='movie-page-heading'>Overview</h3>
                                <p>{movie.description || <span className='font-italic text-muted'>no overview available</span>}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs className='mb-5'>
                                <h3 className='movie-page-heading'>Starring</h3>
                                <div className='scrolling-feed'>
                                   {cast && cast.length? cast : <p className='text-muted font-italic'>cast details unavailable ¯ \_(ツ)_/¯</p>}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs className='mb-5'>
                                <h3 className='movie-page-heading mb-3'>Media</h3>
                                {movie.videoUrls && movie.videoUrls.length ? 
                                <div className='d-flex align-items-center'>
                                    <div className='video-body'>
                                       {videos[currentVideo]}
                                       {movie.videoUrls.length > 1? 
                                       <div>
                                                <span className='mx-1 video-buttons' onClick={() => changeVideo("prev")}>Back</span>
                                                <span> {currentVideo+1}/{movie.videoUrls.length} </span>
                                                <span className='mx-1 video-buttons' onClick={() => changeVideo("next")}>Next</span>
                                       </div>: null}
                                    </div>
                                    <div className='video-name d-none d-md-block'>
                                        <p>{movie.videoUrls[currentVideo]?.name || ''}</p>
                                    </div>
                                </div>
                                : <p className='text-muted font-italic'>media unavailable (˘･_･˘)</p> }
                             </Col>
                        </Row>
                        <Row>
                            <Col xs className='mb-5'>
                                <h3 className='movie-page-heading mb-0'>Top Reviews</h3>
                                <div ref={reviewFeedRef} className='review-feed' style={{maxHeight: reviewFeedExpanded?"100%":"300px"}}>
                                    {seeMoreBtn.reviewsPresent ? reviews: <p className='mt-2 text-muted font-italic'>reviews unavailable (¬_¬")</p>}
                                    {seeMoreBtn.reviewsPresent && seeMoreBtn.heightOver300 && !reviewFeedExpanded ? <div style={{height:"70%", position:'absolute', backgroundImage:'linear-gradient(0deg, black, rgba(0,0,0,0.7), transparent)', width:'100%', bottom:'0'}} /> : null}
                                </div>
                                {seeMoreBtn.reviewsPresent && seeMoreBtn.heightOver300 ? 
                                    <p className='review-expand-btn' style={reviewFeedExpanded? {position:'relative', boxShadow:'none'}: null} onClick={() => setReviewFeedExpanded(!reviewFeedExpanded)}>
                                        {reviewFeedExpanded? "Collapse": "Read more"}
                                    </p> : null
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col xs className='mb-5'>
                                <h3 className='movie-page-heading'>Similar recommendations</h3>
                                <div className='scrolling-feed'>
                                   {recommendations && recommendations.length? recommendations : <p className='text-muted font-italic'>recommendations unavailable ¯ \_(ツ)_/¯</p>}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        )
    }

    return (
        <SkeletonTheme color="#505050" highlightColor="#303030">
            <LoadingComponent page="movie" />
        </SkeletonTheme>
    )
}

export default withRouter(MovieComponent)