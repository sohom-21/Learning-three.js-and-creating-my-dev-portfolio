import React from 'react'
import ShinyText from "../micro_designs/ShinyText.jsx";

const Button = ({name, isBeam=false, containerClass}) => {
    return (
        <ShinyText text={name} disabled={false} speed={4} className={`custom-class btn ${containerClass}`} />
    )
}
export default Button
