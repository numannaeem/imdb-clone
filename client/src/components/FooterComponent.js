function Footer(props) {
    return(
        <footer className='p-3'>
            <h5>Website designed by Numan Naeem</h5>
            <div className='footer-icons'>
                <a href="https://www.instagram.com/num4n_/" target='blank'>
                    <span className='fab fa-instagram'></span>
                </a>{' '}
                <a href="https://www.linkedin.com/in/numan-naeem-7a950b207/" target='blank'>
                    <span className='fab fa-linkedin'></span>
                </a>{' '}
                <a href='https://www.github.com/numannaeem' target='blank'>
                    <span className='fab fa-github'></span>
                </a>{' '}
            </div>
            <hr/>
            <h6>All data retrieved via the <a style={{color:"blue"}} href="https://developers.themoviedb.org/3" target='_blank' rel='noreferrer'>TMDb API</a></h6>
        </footer>
    )
}

export default Footer