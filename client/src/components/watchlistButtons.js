import plusAnimationData from '../plusAnimation.json'
import minusAnimationData from '../minusAnimation.json'
import Lottie from 'react-lottie'
import { useState } from 'react'

function AddButton(props) {

    const [paused,setPaused] = useState(true)

    const addToWatchList = () => {
        console.log(JSON.parse(props.name))
        localStorage.setItem(`mId:${props.movieId}`, props.name);
        props.onClick();
    }

    const defaultOptions = {
        loop: true,
        autoplay: false,
        animationData: plusAnimationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };

    return(
        <button className='watchlist-button add-button' variant='outline-dark'
            onMouseEnter={() => setPaused(false)} 
            onMouseLeave={() => setPaused(true)}
            onClick={() => addToWatchList()} 
        >
                <Lottie isStopped={paused} options={defaultOptions} width={38} height={38} isClickToPauseDisabled/>
            Add to watchlist
        </button>
    )

}

function DeleteButton(props) {

    const [paused,setPaused] = useState(true)

    const removeFromWatchList = () => {
        localStorage.removeItem(`mId:${props.movieId}`);
        props.onClick();
    }

    const defaultOptions = {
        loop: true,
        autoplay: false,
        animationData: minusAnimationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };

    return(
        <button className='watchlist-button delete-button' variant='outline-dark'
            onMouseEnter={() => setPaused(false)} 
            onMouseLeave={() => setPaused(true)} 
            onClick={() => removeFromWatchList()} 
        >
                <Lottie isStopped={paused} options={defaultOptions} width={38} height={38} isClickToPauseDisabled/>
            Remove from watchlist
        </button>
    )
}

export {AddButton, DeleteButton}