import React from 'react'

const icons = import.meta.glob('/src/assets/*.{png,jpg,svg}', {
    eager: true,
    query: '?url',
    import: 'default'
}) as Record<string, string>;

interface ImgButtonProps {
    styling: string;
    imageName: string
    callback: () => void;
}



interface ButtonProps {
    styling: string;
    label: string
    callback: () => void;
}

const Button: React.FC<ButtonProps> = React.memo(({styling, label, callback}) => {
    return (
        <>
        <button className={styling} onClick={callback}>
            <p>{label}</p>
        </button>
        </>
    )
});

const ImgButton: React.FC<ImgButtonProps> = React.memo(({styling, imageName, callback}) => {
    const imagePath = icons[`/src/assets/${imageName}`];
    console.log(imagePath);
    if (!imagePath) {
        console.error("Image does not exist");
        return null;
    }
    return (
        <>
        <button className={styling} onClick={callback}>
            <img src={imagePath} className='w-100% h-100%'></img>
        </button>
        </>
    )
});

export {Button, ImgButton };