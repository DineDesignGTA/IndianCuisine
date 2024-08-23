import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@mui/styles'
import React from 'react'

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                    <link href="https://fonts.googleapis.com/css2?family=Satisfy&display=swap" rel="stylesheet" />
                    <link href="https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap" rel="stylesheet"></link>
                    <script src="https://static.elfsight.com/platform/platform.js" data-use-service-core defer></script>


                     <link rel="icon" href="/favicon.ico" />
 
    
                    {/* <script defer src="https://cloud.umami.is/script.js" data-website-id="99d4635f-5c73-41ed-b3aa-1062cde5ca9d"></script> */}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
