import React, { useEffect, useState, useRef } from 'react';
import firebase from 'firebase/app';
import { useFirestoreQuery } from '../utils/hooks';
import Message from './Message';
import styles from './Channel.module.css';

const Channel = ({ user = null }) => {
    const db = firebase.firestore();
    const messagesRef = db.collection('Messages');
    const messages = useFirestoreQuery(
        messagesRef.orderBy('createdAt', 'desc').limit(100)
    );

    const [newMessage, setNewMessage] = useState('');

    const inputRef = useRef();
    const bottomListRef = useRef();

    const { uid, displayName, photoURL } = user;

    useEffect(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, [inputRef]);

    const handleOnChange = e => {
        setNewMessage(e.target.value);
    };

    const handleOnSubmit = e => {
        e.preventDefault();
      
        const trimmedMessage = newMessage.trim();
        if (trimmedMessage) {
          // Add new message in Firestore
          messagesRef.add({
            text: trimmedMessage,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            displayName,
            photoURL,
          });
          // Clear input field
          setNewMessage('');
          // Scroll down to the bottom of the list
          bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      };      
    
    return (
    <div className={styles.channelContainer}>
        <div style={{ overflow: 'auto', height: '100%' }}>
            <div className={styles.msgContainer}>
                <div className={styles.msgWindow}>
                    <div className={styles.msgWelcome}>
                        <p style={{ marginBottom: '0.25rem' }}>Welcome to</p>
                        <p style={{ marginBottom: '0.75rem' }}>React FireChat</p>
                    </div>
                    <p style={{ color: '#545B63', textAlign: 'center' }}>
                    This is the beginning of this chat.
                    </p>
                </div>
                <ul>
                    {messages
                    ?.sort((first, second) =>
                        first?.createdAt?.seconds <= second?.createdAt?.seconds ? -1 : 1
                    )
                    ?.map(message => (
                        <li key={message.id}>
                            <Message {...message} />
                        </li>
                    ))}
                </ul>
                <div ref={bottomListRef} />
            </div>
        </div>
        <div className={styles.formContainer}>
            <form
            onSubmit={handleOnSubmit}
            className={styles.msgForm}
            >
            <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={handleOnChange}
                placeholder="Type your message here..."
                className={styles.msgInput}
            />
            <button
                type="submit"
                disabled={!newMessage}
                className={styles.msgSubmitBtn}
            >
                Send
            </button>
            </form>
        </div>
    </div>
    );
};
  
export default Channel;
  