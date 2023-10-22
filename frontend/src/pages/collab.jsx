import React, { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import ShareDBClient from 'sharedb-client';
import ReconnectingWebSocket from 'reconnecting-websocket'
import { COLLAB_SVC_URI } from "@/config/uris";
import DescriptionPanel from "@/components/CollabPage/DescriptionPanel";
import EditorPanel from "@/components/CollabPage/EditorPanel";

const connect = () => {
  // TODO: try socket.io with reconnecting-websocket
  const socket = new ReconnectingWebSocket(COLLAB_SVC_URI);
  const connection = new ShareDBClient.Connection(socket);
  return connection;
}

export default function CollabPage() {
  const [content, setContent] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [collabDoc, setCollabDoc] = useState(null);
  const [language, setLanguage] = useState("javascript");

  // TODO: find a way to share the value of editor's language

  useEffect(() => {
    // TODO: fetch and set session id here
    const id = "test_id"

    const doc = connect().get('collab-docs', id);
    console.log(`connect to doc with id ${id}`);
    setCollabDoc(doc);

    doc.subscribe((err) => {
      if (err) {
        console.error(err);
      } else {
        if (!doc.type) {
          doc.create({ content: '', language: 'javascript' });
        }
        console.log("subscribe and set data");
        setContent(doc.data.content);
        setLanguage(doc.data.language);
      }
    });

    doc.on('op', (op, source) => {
      if (source !== doc) {
        setContent(doc.data.content);
        setLanguage(doc.data.language);
      }
    });

    return () => {
      doc.unsubscribe((err) => {
        if (err) {
          console.error("An error occurred when unsubscribing: ", err);
        } else {
          console.log("Unsubscribed successfully");
        }
      });
    }
  }, []);

  const handleInputChange = (value, e) => {
    const newContent = value;
    collabDoc.submitOp([{ p: ['content'], oi: newContent }]);
    setContent(collabDoc.data.content);
  }

  const handleLanguageSelect = (e) => {
    const newLanguage = e.target.value;
    collabDoc.submitOp([{ p: ['language'], oi: newLanguage }]);
    setLanguage(collabDoc.data.language);
  }

  // 4 main components: *question, *editor, program output, video chat
  // all components should be resizable
  // video window should be draggable
  return (
    <Box
      sx={{ m: 0, width: "100vw", height: "100vh", bgcolor: (theme) => theme.palette.primary.dark }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%', p: 1, gap: 1}}>
        <Box sx={{ minWidth: 290, width: 750 }}>
          <DescriptionPanel />
        </Box>
        <EditorPanel value={content} onChange={handleInputChange} language={language} handleLanguageSelect={handleLanguageSelect} />
      </Box>
    </Box>
  );
}