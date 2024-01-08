import Head from "next/head";
import dynamic from "next/dynamic";
import "@sendbird/uikit-react/dist/index.css";

const DynamicAppWithNoSSR = dynamic(() => import("../components/chat"), {
  ssr: false,
  loading: () => <p>...</p>,
});

export default function Chat() {
  return (
    <>
      <Head>
        <title>Kallun Technical Task</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <DynamicAppWithNoSSR />
      </main>
    </>
  );
}
