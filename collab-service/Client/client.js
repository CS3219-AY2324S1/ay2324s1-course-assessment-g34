import ShareDBClient from 'sharedb-client'
import ReconnectingWebSocket from 'reconnecting-websocket';

const sharedbPort = 8080;
const opKeyWord = 'op';
const inputKeyWord = 'input';
const stdWebSocketCloseCode = 1000;
/** 
 * Connect an HTML input or textarea element to collaboration (concurrent editing) service.
 * @param htmlEditArea the HTML input or textarea element
 * @param sessionID the match session ID string.
 * @returns The 'unsubsribe' runnable
 */
const subscribeCollab = (htmlEditArea, sessionId) => {
    const rws = new ReconnectingWebSocket(`ws://localhost:${sharedbPort}`);
    const connection = new ShareDBClient.Connection(rws);
    // https://share.github.io/sharedb/api/connection#get
    const doc = connection.get('collab_docs', sessionId);

    const fetch = () => {
        htmlEditArea.value = doc.data.content;
    }
    doc.subscribe((err) => {
        if (err) throw err;
        if (doc.type === null)
            doc.create({ content: '' });
        fetch();
        doc.on(opKeyWord, fetch);
    });

    const sendInput = (e) => {
        const op = [{ p: ['content'], oi: e.target.value }];
        doc.submitOp(op);
    }
    htmlEditArea.addEventListener(inputKeyWord, sendInput);

    return () => {
        doc.removeListener('op', fetch);
        doc.unsubscribe((err) => {
            if (err) console.error('Error unsubscribing:', err);
            else console.log('Unsubscribed successfully');
        });
        rws.close(stdWebSocketCloseCode, 'Closing connection normally');
        htmlEditArea.removeEventListener(inputKeyWord, sendInput);
    }
}

// test
window.test_join = sessionId => {
    window.test_quit = subscribeCollab(document.getElementById('editor'), sessionId);
}