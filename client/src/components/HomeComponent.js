import { useRef } from "react";
import { Row, Col, Container, Form } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"

function HomeComponent(props) {

    const homeSearchRef = useRef('')
    const history = useHistory();

    const search = (e,query) => {
        e.preventDefault()
        console.log(query)
        if(query) {
            window.scrollTo(0,0)
            history.push(`/search?query=${query}&page=1`);
        }
    }

    return(
        <>
            <div className='home-header'> 
                <h1>Welcome.</h1>
                <h2 className='font-weight-light'>the movie database for all your movie needs!</h2>
            </div>
            <Container>
                <Row>
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
                            <Form inline='true' style={{width:'70%',flexWrap:'nowrap', minWidth:'275px'}} onSubmit={(e) => search(e,homeSearchRef.current.value)}>
                                <input ref={homeSearchRef} style={{width:'100%'}} type='text' placeholder='Search for movies or people'/>
                                <button type='submit'><i className='fa fa-search'></i></button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default HomeComponent