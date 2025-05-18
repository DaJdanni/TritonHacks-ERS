import React from 'react'
import { ImgButton, Button } from './Button'
// import generateResponse from '../api/AIBot'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import userData from '../api/MapData'
import fetchResponse from '../api/AIBot'

interface messageObject {
    id: string,
    message: string
}

const Chatbot: React.FC = React.memo(() => {

    const [thinking, setThinking] = React.useState(false);
    const [currentMessage, setCurrentMessage] = React.useState('');
    const [messageHistory, setHistory] = React.useState<messageObject[]>([]);
    const [chatOpacity, setChatOpacity] = React.useState('opacity-0');

    const chatbotStyle =
    'absolute z-8 top-25 lg:top-5 left-1/2 -translate-x-1/2 lg:left-auto lg:right-5 lg:translate-x-0 h-[75vh] w-[95vw] sm:w-[25vw] min-w-[300px] max-w-sm bg-palette-brown border-palette-dark-brown border-4 rounded-3xl flex flex-col items-center justify-between overflow-hidden ' + chatOpacity + ' lg:opacity-100'

    const showChatbot = () => {
        if (chatOpacity === 'opacity-0') {
            setChatOpacity('opacity-100');
        } else {
            setChatOpacity('opacity-0');
        }
    }

    const onChangeCallback = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentMessage(event.target.value);
    }

    const onSetMessages = (sender: string, newMessage: string) => {
        const oldMessages = messageHistory;
        oldMessages.push({id: sender, message: newMessage});
        setHistory(oldMessages);
    }

    React.useEffect(() => {
        
        const handleKeyDown = async (e: KeyboardEvent) => {
            if (e.key === "Enter" && thinking == false && currentMessage != '') {
                console.log("sent message of: " + currentMessage);
                onSetMessages('User', currentMessage);
                setCurrentMessage('');

                setThinking(true);

                const response = await fetchResponse(currentMessage);

                if (response !== undefined) {
                    onSetMessages('AI', response);
                } else {
                    onSetMessages('AI', "Could not send response!");
                }

                setThinking(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
           window.removeEventListener("keydown", handleKeyDown);
        }
    })

    return (
        <>
        <div className={chatbotStyle}>
        <div className='p-2 text-center'>
            <h1 className='text-white text-2xl mt-4'>AI Chat Bot</h1>
            {thinking ? (
            <h2 className='text-white text-lg mt-2 mb-4'>
                AI is currently thinking...
            </h2>
            ) : (
                <h2 className='text-white text-lg mt-2 mb-4'>
                What can I help with?
            </h2>
            )}

            </div>

            <div className="relative w-full overflow-y-auto h-[30rem]">
            {messageHistory.map((object, index) => (
                <div key={index} className={`flex mb-2 ${object.id === 'AI' ? 'justify-start' : 'justify-end'}`}>
                <div
                className={`bg-amber-300 rounded-2xl p-3 text-black max-w-[300px] overflow-auto break-words ${
                    object.id === "AI" ? 'bg-amber-600 text-white' : 'bg-amber-800 text-white'
                }`}
                >
                <p className='whitespace-pre-line'>{object.message}</p>
                </div>
  </div>
            ))}
            </div>

            <input type='text' placeholder='Start typing here...' value={currentMessage} onChange={onChangeCallback} className='w-[95%] bg-palette-dark-brown rounded-2xl h-16 mb-4 p-2 text-sm font-medium text-gray-900 dark:text-white'>
                
            </input>
        </div>
        <Button styling='z-8 fixed right-5 bottom-5 h-15 w-15 bg-gray-800 text-white opacity-100 lg:opacity-0' label='Click me!' callback={showChatbot}></Button>
        </>
    
    )

})

export default Chatbot;