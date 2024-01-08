import SBDMain from "sendbird";

const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
const USER_ID = process.env.NEXT_PUBLIC_USER_ID;

const sb = new SBDMain({
  appId: APP_ID,
});

const fetchChannels = (callback) => {
  console.log("fetchChannels called");

  sb.connect(USER_ID, function (user, error) {
    if (error) {
      console.error("Connection failed", error);
      return;
    }

    const channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
    channelListQuery.next(function (groupChannels, error) {
      if (error) {
        console.error("Failed to load channels", error);
        return;
      }

      groupChannels.forEach((channel) => {
        console.log(`Channel URL: ${channel.url}`);
        console.log(`Created by: ${channel.createdBy}`);
        console.log(`Chatmate identifier: ${channel.members[0].userId}`);
        console.log(`Deleted: ${channel.isDeleted}`);
        console.log(`Total number of messages: ${channel.messageCount}`);
        console.log(`Creation date: ${channel.createdAt}`);
      });

      callback(groupChannels);
    });
  });
};

export { sb, fetchChannels };
