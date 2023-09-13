import Layout from "@/components/Layout";
import { Box, Container, TableRow, Typography } from "@mui/material";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans( {subsets: ['latin'] });

export default function QuestionPage() {
  return (
    <>
      <Layout>
        <Container
          maxWidth="xl"
          sx={{ bgcolor: '#172A46', height: '100vh'}}
        >
          <Typography
            variant="h5"
            noWrap
            component="h5"
            sx={{
              textAlign: 'center',
              fontFamily: openSans.style,
              color: '#CDD7F7',
              fontWeight: 'bold',
              fontSize: '30px'
            }}
          >
            Questions
          </Typography>
          <Box>
            Add Question here
          </Box>
          <Box>
            <TableRow
              sx={{ '& > *': { borderBottom: 'unset' }}}
            >

            </TableRow>
          </Box>
        </Container>
      </Layout>
    </>
  );
}