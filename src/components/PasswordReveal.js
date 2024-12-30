import './PasswordReveal.css';
import React, { useEffect, useRef, useState } from 'react';
import { useDelayedState } from '../hooks';

const PasswordEye = ({opened, onClick}) => {
    const [relPos, setRelPos] = useState([0, 0]);

    const eyelidRef = useRef(null);
    const pupilRef = useRef(null);

    const fitToRange = (pos, maxDistance) => {
        const r = Math.sqrt(pos[0]**2 + pos[1]**2);
        if (r > maxDistance) 
            return [maxDistance * pos[0] / r, maxDistance * pos[1] / r];
        else
            return pos;
    }

    useEffect(() => {
        if (eyelidRef.current) {
            const prevState = opened ? 'closed' : 'opened';
            const newState = opened ? 'opened' : 'closed';

            [eyelidRef, pupilRef].forEach(ref => {
                ref.current.classList.remove(prevState);
                void ref.current.offsetWidth;
                ref.current.classList.add(newState);
            })
        }

        const handleMouseMove = (e) => {
            if (pupilRef.current && opened) {
                const rect = pupilRef.current.getBoundingClientRect()
                const newRelPos = fitToRange([
                    (e.clientX - rect.left) / 20, 
                    (e.clientY - rect.top) / 20
                ], 3);
                setRelPos(newRelPos);
            }
        }
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [opened]);

    return (
        <div className='eye-container' onClick={onClick}>
            <div className='eye-eyelid-top' ref={eyelidRef}></div>
            <div className='eye-eyelid-bottom'></div>
            <div className='pupil' ref={pupilRef} 
                style={{
                    left: `calc(50% + ${relPos[0]}px)`,
                    top: `calc(50% + ${relPos[1]}px)`
                }}>
                <div className="pupil-highlight"></div>
            </div>
        </div>
    );
}

const PasswordReveal = ({value, placeholder, onChange}) => {
    const [visible, setVisible, isChanging] = useDelayedState(true, 300);
    const [maskedValue, setMaskedValue] = useState(value);
    const inputRef = useRef();

    useEffect(() => setMaskedValue(value), [value]);

    const randomString = (n) => {
        const charSet = ['!','@','#','$','%','^','&','*'];
        let ret = '';
        for(let i = 0; i < n; i++) ret += charSet[Math.floor(Math.random() * charSet.length)];
        return ret;
    }

    return (
        <div className='password-reveal-container'>
            <input className='password-reveal-input'
                type={visible === false ? 'password' : 'text'} 
                value={visible === false ? value : maskedValue} 
                placeholder={placeholder}
                onChange={onChange}
                readOnly={value.isChanging}
                ref={inputRef}
            />
            <PasswordEye opened={(visible === true) | (isChanging & visible.to)} 
                onClick={()=> {
                    if (visible) {
                        let newMaskedValue = maskedValue;
                        const coverValue = (i) => {
                            if (i >= value.length) {
                                inputRef.current.focus();
                                return;
                            };
                            const obfus = Math.min(4, value.length-i-1);
                            newMaskedValue = newMaskedValue.substr(0, i) + '•' + randomString(obfus) + newMaskedValue.substr(i+1+obfus);
                            setMaskedValue(newMaskedValue);
                            setTimeout(() => coverValue(++i), 300 / value.length);
                        };
                        coverValue(0);

                        setVisible(false);
                    }
                    else {
                        let newMaskedValue = '•'.repeat(value.length);
                        const coverValue = (i) => {
                            if (i >= value.length) { 
                                setMaskedValue(value); 
                                inputRef.current.focus();
                                return; 
                            }
                            const obfus = Math.min(4, value.length-i-1);
                            newMaskedValue = newMaskedValue.substr(0, i) + value[i] + randomString(obfus) + newMaskedValue.substr(i+1+obfus);
                            setMaskedValue(newMaskedValue);
                            setTimeout(() => coverValue(++i), 300 / value.length);
                        };
                        coverValue(0);
                        setVisible(true);
                    }
                }}
            />
        </div>
    )
}

export default PasswordReveal;