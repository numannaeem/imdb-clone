import Skeleton, {SkeletonTheme} from "react-loading-skeleton"
import { Container, Row, Col } from "react-bootstrap"

export default function LoadingComponent({page}) {
    if(page === 'cast') {
        return(
            <SkeletonTheme color="#505050" highlightColor="#303030">
            <Container>
                <Row >
                    <Col className="cast-page" xs>
                        <div className='cast-header'>
                            <Skeleton height={400} width={300}/>
                            <div className='ml-md-2 cast-details'>
                                <h1 className='mb-2'><Skeleton width={300}/></h1>
                                <p>{<Skeleton count={2}/>}</p>
                            </div>
                        </div>
                        <h4 className='text-warning'>Movie wall</h4>
                        <div className='movie-wall'>{<Skeleton height={50} width={200} count={4} className='mr-3'/>}</div>
                        <h4 className='text-warning'>Biography</h4>
                        <p style={{lineHeight:'1.6'}}>{<Skeleton count={6} />}</p>
                    </Col>
                </Row>
            </Container>
        </SkeletonTheme>
        )
    }

    if(page === 'cast-feed') {
        return (
            <SkeletonTheme color="#505050" highlightColor="#303030">
                <Skeleton height={250} width={150} className="mr-3"/>
                <Skeleton height={250} width={150} className="mr-3"/>
                <Skeleton height={250} width={150} className="mr-3"/>
            </SkeletonTheme>
        )
    }

    if(page ==='feed') {
        return(
                <>
                    <Col xs={6} sm={6} md={4} lg={3} className='p-sm-3 p-2 text-center feed-skeleton'>
                        <Skeleton height="100%"/>
                    </Col>
                    <Col xs={6} sm={6} md={4} lg={3} className='p-sm-3 p-2 text-center feed-skeleton'>
                        <Skeleton height="100%"/>
                    </Col>
                    <Col xs={6} sm={6} md={4} lg={3} className='p-sm-3 p-2 text-center feed-skeleton'>
                        <Skeleton height="100%"/>
                    </Col>
                    <Col xs={6} sm={6} md={4} lg={3} className='p-sm-3 p-2 text-center feed-skeleton'>               
                        <Skeleton height="100%"/>        
                    </Col>
                    <Col xs={6} sm={6} md={4} lg={3} className='p-sm-3 p-2 text-center feed-skeleton'>
                        <Skeleton height="100%"/>
                    </Col>
                    <Col xs={6} sm={6} md={4} lg={3} className='p-sm-3 p-2 text-center feed-skeleton'>
                        <Skeleton height="100%"/>
                    </Col>
                    <Col xs={6} sm={6} md={4} lg={3} className='p-sm-3 p-2 text-center feed-skeleton'>
                        <Skeleton height="100%"/>
                    </Col>
                    <Col xs={6} sm={6} md={4} lg={3} className='p-sm-3 p-2 mb-5 text-center feed-skeleton'>               
                        <Skeleton height="100%"/>        
                    </Col>
                </>
        )
    }

    if(page==="movie") {
        return (
            <div className='movie-page'>
                <div className='movie-page-header'>
                    <Skeleton height={512} width={342} className='d-none d-md-block'/>
                    <div className='header-details header-details-skeleton'>
                        <p>{<Skeleton width="max(40%,200px)" height={50}/>}</p>
                        <h5 className='font-weight-light font-italic'>{<Skeleton />}</h5>
                        <div>
                            <Skeleton count={3}/>
                        </div>
                    </div>
                </div>
                <div className='movie-page-body'>
                    <Container>
                        <Row>
                            <Col xs className='mb-3'>
                                <h3 className='movie-page-heading'>Overview</h3>
                                 <p><Skeleton count={5}/></p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs className='mb-3'>
                                <h3 className='movie-page-heading'>Top Cast Cembers</h3>
                                <div className='cast-feed'>
                                    <Skeleton height={250} width={150} className="mr-3"/>
                                    <Skeleton height={250} width={150} className="mr-3"/>
                                    <Skeleton height={250} width={150} className="mr-3"/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs className='mb-3'>
                                <h3 className='movie-page-heading'>Reviews</h3>
                                <p><Skeleton count={3}/></p>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        )
    }
}