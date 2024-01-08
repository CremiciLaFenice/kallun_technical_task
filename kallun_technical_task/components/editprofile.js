import { useEffect, useState } from "react";
import "../app/globals.css";
import SBDMain from "sendbird";

export default function EditProfilePopup({
  setShowEditProfile,
  setShowUpdateSuccess,
  setShowUpdateFail,
}) {
  const [nickname, setNickname] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isValidNickname, setIsValidNickname] = useState(true);
  const [nicknameError, setNicknameError] = useState("");
  const [imageError, setImageError] = useState("");
  const [sb, setSb] = useState(null);

  useEffect(() => {
    const sb = new SBDMain({
      appId: process.env.NEXT_PUBLIC_APP_ID,
    });

    sb.connect(process.env.NEXT_PUBLIC_USER_ID, function (user, error) {
      if (error) {
        console.error("Connection failed", error);
        return;
      }

      setSb(sb);
    });
  }, []);

  const handleUrlChange = (event) => {
    setProfileUrl(event.target.value);
    setIsValidUrl(true);
  };

  const handleUrlBlur = async () => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const urlExtension = profileUrl.split(".").pop().toLowerCase();

    if (!imageExtensions.includes(urlExtension)) {
      setImageError("Invalid image url.");
      setIsValidUrl(false);
      return;
    }

    try {
      await fetch(profileUrl);
      setIsValidUrl(true);
    } catch (error) {
      setIsValidUrl(false);
    }
  };

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
    setIsValidNickname(!!event.target.value);
    setNicknameError(event.target.value ? "" : "Nickname cannot be blank");
    setNicknameError(
      event.target.value.length > 20
        ? "Nickname cannot exceed 20 characters"
        : ""
    );
  };

  const handleConfirm = () => {
    if (sb && nickname && profileUrl) {
      // Check if profileUrl is valid
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];
      const urlExtension = profileUrl.split(".").pop().toLowerCase();

      setImageError(
        profileUrl
          ? imageExtensions.includes(urlExtension)
            ? ""
            : "Only jpg, jpeg, png, gif formats are supported."
          : "Profile url is required."
      );

      fetch(profileUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Invalid profile URL: ${profileUrl}`);
          }
          return sb.updateCurrentUserInfo(nickname, profileUrl);
        })
        .then(() => {
          // Save the user details to your database
          console.log("User created with nickname: " + nickname);
          console.log("User created with profile URL: " + profileUrl);

          setShowUpdateSuccess(true);
        })
        .catch((error) => {
          setShowUpdateFail(false);
        });
    } else {
      setIsValidNickname(false);
      setIsValidUrl(false);
      setNicknameError(" Nickname is required.");
      setImageError(" Profile url is required.");
    }
  };

  const placeHolderImage = process.env.NEXT_PUBLIC_PLACEHOLDER_IMAGE;

  const handleCancel = () => {
    setShowEditProfile(false);
  };

  return (
    <div className="popup">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <img src={profileUrl || placeHolderImage} alt="Profile Preview" />
        <div>
          <label>
            Nickname:
            {!isValidNickname && (
              <span style={{ color: "red" }}>{nicknameError}</span>
            )}
            <input
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              style={isValidNickname ? {} : { outlineColor: "red" }}
            />
            <br />
          </label>
          <label>
            Profile URL:
            {!isValidUrl && <span style={{ color: "red" }}>{imageError}</span>}
            <input
              type="url"
              value={profileUrl}
              onChange={handleUrlChange}
              onBlur={handleUrlBlur}
              style={isValidUrl ? {} : { outlineColor: "red" }}
            />
            <br />
          </label>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button onClick={handleCancel}>Cancel</button>
        <button
          onClick={handleConfirm}
          disabled={!isValidUrl || !isValidNickname}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
