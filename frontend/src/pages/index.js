import Layout from '@/components/Layout'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>PeerPrep</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="description" content="PeerPrep is a technical interview preparation platform where students can find peers to practise interview questions together" />
      </Head>
      <Layout>
        <h1>Welcome to PeerPrep</h1> 
      </Layout>
    </>
  )
}
