import { useEffect, useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { useHistory } from "react-router";
import LoadingComponent from "./LoadingComponent";

function CastComponent({id}) {
    
    const history = useHistory();

    const dispMovie = (id) => {
        history.push(`/movie/${id}`)
    }

    const [cast, setCast] = useState(null)

    useEffect(() => {
        window.scrollTo(0,0)
        let today = new Date().toISOString().substr(0,10)
        fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&append_to_response=movie_credits`)
            .then(res => res.json())
            .then(data => {
                const options = {year: 'numeric', month: 'long', day: 'numeric' }
                const filteredCast = {
                    name: data.name,
                    birthday: data.birthday ? new Date(data.birthday).toLocaleDateString('en-US',options): null,
                    deathday: data.deathday ? new Date(data.deathday).toLocaleDateString('en-US',options): null,
                    pictureUrl: data.profile_path ? `https://image.tmdb.org/t/p/h632/${data.profile_path}` : 'https://static.stayjapan.com/assets/user_no_photo-4896a2d64d70a002deec3046d0b6ea6e7f01628781493566c95a02361524af97.png',
                    bio: data.biography,
                    birthplace: data.place_of_birth,
                    aliases: data.also_known_as,
                    department: data.known_for_department,
                    age: data.birthday && !data.deathday ? Math.floor((new Date(today) - new Date(data.birthday))/(1000*24*60*60*365)): null,
                    knownFor: data.known_for_department === 'Acting' ? data.movie_credits.cast?.map(m => ({
                        title: m.title, 
                        id: m.id, 
                        imgUrl: m.poster_path ? `https://image.tmdb.org/t/p/w92/${m.poster_path}` : 'https://faculty.eng.ufl.edu/dobson-lab/wp-content/uploads/sites/88/2015/11/img-placeholder.png'
                    })) : data.movie_credits.crew?.map(m => ({
                        title: m.title, 
                        id: m.id, 
                        imgUrl: m.poster_path ? `https://image.tmdb.org/t/p/w92/${m.poster_path}` : 'https://faculty.eng.ufl.edu/dobson-lab/wp-content/uploads/sites/88/2015/11/img-placeholder.png'
                    }))
                }
                setCast(filteredCast)
            }) 
    }, [id])

    if(cast) {
        const knownFor = cast.knownFor?.filter((movie,i) => cast.knownFor.findIndex(m => m.id === movie.id) === i).map(m => {
            return(
                <div className='known-for' key={m.id} onClick={() => dispMovie(m.id)}>
                    <img src={m.imgUrl} alt="poster" height='100px' width='100px'/>
                    <h6>{m.title}</h6>
                </div>
            )
        })
        const aliases = cast.aliases && cast.aliases.length? cast.aliases.map((a,idx) => idx !== cast.aliases.length - 1 ? a + ' • ' : a) : null
        return(
            <Container>
                <Row >
                    <Col className="cast-page" xs>
                        <div className='cast-header'>
                            <img src={cast.pictureUrl} alt="Profile" width="266px" height="400px" />
                            <div className='cast-details'>
                                <h1 className='font-weight-bold'>{cast.name}</h1>
                                {cast.birthday ? <h5>Born on {cast.birthday} in {cast.birthplace || '-'} {cast.age ? <span className='text-muted '>({cast.age} years old)</span> : null}</h5> : null}
                                {cast.deathday ? <h5 className='text-muted'>Died on {cast.deathday}</h5>:null}
                                <p><span className='text-warning'>Known for:</span> {cast.department || '-'}</p>
                                <p><span className='text-warning'>Aliases:</span> {aliases || '-'}</p>
                            </div>
                        </div>
                        <h4 className='text-warning'>Movie Wall</h4>
                        <div className='movie-wall'>{knownFor && knownFor.length ? knownFor : <p className=' text-muted font-italic'>none available</p>}</div>
                        <h4 className='text-warning'>Biography</h4>
                        <p style={{lineHeight:'1.6'}}>{cast.bio || <span className='text-muted font-italic'>no biography available</span>}</p>
                    </Col>
                </Row>
            </Container>
        )
    }
    return (
        <LoadingComponent page="cast" />
    )
}

export default CastComponent