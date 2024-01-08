import { useEffect, useState } from "react";
import SendbirdApp from "@sendbird/uikit-react/App";
import EditProfilePopup from "./editprofile";
import { sb, fetchChannels } from "./sendbirdInstance";

const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
const USER_ID = process.env.NEXT_PUBLIC_USER_ID;

export default () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showUpdateFail, setShowUpdateFail] = useState(false);
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    console.log("useEffect called");
    sb.connect(USER_ID, function (user, error) {
      if (error) {
        console.error("Connection failed", error);
        return;
      }

      sb.addChannelHandler("channelCreated", function (channel) {
        console.log("New channel created: ", channel);
        fetchChannels(setChannels);
      });

      fetchChannels((newChannels) => setChannels(newChannels));
      const intervalId = setInterval(() => fetchChannels(setChannels), 5000); // Fetch every 5 seconds

      return () => {
        clearInterval(intervalId); // Clear the interval when the component unmounts
      };
    });
  }, []);

  const handleClick = (event) => {
    try {
      if (event.target.className.includes("sendbird-channel-header__title")) {
        setShowEditProfile(!showShowEditProfile);
      }
    } catch {
      //do nothing
    }
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }} onClick={handleClick}>
      <SendbirdApp appId={APP_ID} userId={USER_ID} theme="dark" />
      {showEditProfile && (
        <EditProfilePopup
          setShowEditProfile={setShowEditProfile}
          setShowUpdateSuccess={setShowUpdateSuccess}
          setShowUpdateFail={setShowUpdateFail}
        />
      )}
      {showUpdateSuccess && (
        <div className="success-dialog">
          <p>Profile has been updated.</p>
          <button onClick={() => window.location.reload()}>OK</button>
        </div>
      )}
      {showUpdateFail && (
        <div className="fail-dialog">
          <p>error, cant update profile</p>
          <button onClick={() => setShowUpdateFail(false)}>OK</button>
        </div>
      )}
    </div>
  );
};
