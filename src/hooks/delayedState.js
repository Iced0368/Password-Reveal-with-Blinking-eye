import { useState, useRef } from 'react';

const useDelayedState = (initialState, delay) => {
    const [state, setState] = useState(initialState);
    const lock = useRef(false);

    const setDelayedState = (newState) => {
        if(lock.current) return;
        setState({from: state, to: newState});

        lock.current = true;
        setTimeout(() => { 
            setState(newState); 
            lock.current = false; 
        }, delay);
    }

    return [state, setDelayedState, lock.current];
}

export default useDelayedState;