import SendbirdApp from '@sendbird/uikit-react/App';
import '@sendbird/uikit-react/dist/index.css';

const App = () => {
    return (
        <div className="App">
            <SendbirdApp
                // Add the two lines below.
                appId='C28C5300-3085-42BA-90D9-7BC5FD722F76'   // Specify your Sendbird application ID.
                userId='sendbird_desk_agent_id_1a37790a-8414-4c2e-8947-b51e945c113c'        // Specify your user ID.
            />
        </div>
    );
};
export default App;


// const sendbird = () => {
//     return (
//         <div className="sendbird">
//             <SendbirdApp
//                 // Add the two lines below.
//                 appId='C28C5300-3085-42BA-90D9-7BC5FD722F76'  // Specify your Sendbird application ID.
//                 userId='sendbird_desk_agent_id_1a37790a-8414-4c2e-8947-b51e945c113c'        // Specify your user ID.
//             />
//         </div>
//     );
// };

// export default sendbird;