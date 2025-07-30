const ShinyText = ({ text, disabled = false, speed = 5, className = '' ,isBeam}) => {
    const animationDuration = `${speed}s`;

    return (
        <div
            className={`text-[#b5b5b5a4] bg-clip-text inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
            style={{
                backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                animationDuration: animationDuration,
            }}
        >
            { isBeam && <span className='relative flex h-3 w-3'>
                <span className='btn-ping'></span>
                <span className='btn-ping_dot'></span>
            </span> }
            {text}
        </div>
    );
};

export default ShinyText;