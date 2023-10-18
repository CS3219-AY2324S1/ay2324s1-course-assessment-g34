import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Box, Container, Skeleton } from "@mui/material";
import ShareDBClient from 'sharedb-client';
import ReconnectingWebSocket from 'reconnecting-websocket'
import { COLLAB_SVC_URI } from "@/config/uris";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import('../components/CollabPage/CollabEditor'), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" height="100vh" />,
})

const connect = () => {
  // TODO: try socket.io instead of reconnecting-websocket
  const socket = new ReconnectingWebSocket(COLLAB_SVC_URI);
  const connection = new ShareDBClient.Connection(socket);
  return connection;
}

export default function CollabPage() {
  const [content, setContent] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [collabDoc, setCollabDoc] = useState(null);

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
          doc.create({ content: '' });
        }
        console.log("subscribe and set data", doc.data.content)
        setContent(doc.data.content);
      }
    });

    doc.on('op', (op, source) => {
      if (source !== doc) {
        setContent(doc.data.content);
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

  return (
    <Layout>
      <Container
        maxWidth="xl"
        sx={{ height: '100vh', my: 2 }}
      >
        <Box>
          <Editor value={content} onChange={handleInputChange} />
        </Box>
      </Container>
    </Layout>
  );
}