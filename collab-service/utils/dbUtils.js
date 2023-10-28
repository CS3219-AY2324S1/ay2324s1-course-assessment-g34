const ShareDBMongo = require('sharedb-mongo');
const ShareDB = require('sharedb');
const WebSocketJSONStream = require('websocket-json-stream');
const mongodbPort = 27017;
const docCollection = "collab-docs";

const dbURL = process.env.DATABASE_URL || `mongodb://localhost:${mongodbPort}/${docCollection}`;
const db = new ShareDB({ db: ShareDBMongo(dbURL) });
const connection = db.connect();

const getDocument = (sessionId) => {
  return connection.get(docCollection, sessionId);
}

const initializeShareDbStream = (ws) => {
  const stream = new WebSocketJSONStream(ws);
  db.listen(stream);
}

const createDocument = async (sessionId) => {
  const doc = getDocument(sessionId);

  doc.fetch((err) => {
    if (err) {
      console.error("Error fetching document", err);
      return;
    }

    if (!doc.type) {
      doc.create({ content: '', language: 'javascript' }, (err) => {
        if (err) {
          console.error("Error creating document", err);
        } else {
          console.log(`Document for session with id = ${sessionId} created.`);
        }
      });
    }
  });

  return doc.id;
};

const deleteDocument = (sessionId) => {
  const doc = getDocument(sessionId);

  if (!doc) {
    return;
  }
  
  doc.del((err) => {
    if (err) {
      console.error("Error deleting document", err);
    } else {
      console.log(`Document for session with id = ${sessionId} deleted.`);
    }
  });
};

module.exports = {
  initializeShareDbStream,
  createDocument,
  deleteDocument
};
