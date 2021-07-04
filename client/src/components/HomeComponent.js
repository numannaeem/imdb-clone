import { useRef } from "react";
import { Row, Col, Container, Form } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import Lottie from 'react-lottie';
import { FadeTransform, Fade } from 'react-animation-components'
import animationData from '../clipboardAnimation.json'

function HomeComponent(props) {

    const homeSearchRef = useRef('')
    const history = useHistory();
    const lottieRef = useRef(null)

    const search = (e,query) => {
        e.preventDefault()
        if(query) {
            window.scrollTo(0,0)
            history.push(`/search?query=${query}&page=1`);
        }
    }

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };

    return(
        <>
            <Fade in duration={200}>
                <div className='home-header'> 
                    <div className='d-md-flex'>
                        <Lottie style={{filter:" drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7))"}} options={defaultOptions} width={100} ref={lottieRef} isClickToPauseDisabled />
                        <h1 className='m-0 w-0 align-self-center'>NuMDb</h1>
                    </div>
                    <h2 className='font-weight-light'>the movie database for all your movie needs!</h2>
                </div>
            </Fade>
            <FadeTransform transformProps={{exitTransform: 'translateY(-100px)'}} duration={400} in>
                <Container>
                    <Row className='my-5'>
                        <Col xs>
                            <div className='home-body'> 
                                <div>
                                    <h5>Browse a collection</h5> 
                                    <div className='home-links'>
                                        <Link to="/popular">Popular</Link>{' '}
                                        <Link to="/top-rated">Top Rated</Link>{' '}
                                        <Link to="/upcoming">Upcoming</Link>{' '}
                                    </div>
                                </div>
                                <h1>or,</h1>
                                <Form className='search-bar' inline='true' onSubmit={(e) => search(e,homeSearchRef.current.value)}>
                                    <input className='search-bar-input' ref={homeSearchRef} style={{width:'100%'}} type='text' placeholder='Search for movies or people'/>
                                    <button type='submit'><i className='fa fa-search'></i></button>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </FadeTransform>
        </>
    )
}

export default HomeComponent