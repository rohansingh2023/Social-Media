import pool from "../../db";
import Consumer from "../../utils/consumer";

interface Payload {
  logType: string;
  message: {
    id: string;
    profilePic: string;
    messageInfo: string;
  };
  dateTime: string;
}

const consumer = new Consumer();

export const addFriend = async () => {
  try {
    const data: Payload = await consumer.consumeMsg("Friend");
    const likeMsgPayload = {
      id: data?.message?.id,
      photo: data?.message?.profilePic,
      message: data?.message?.messageInfo,
      logtype: data?.logType,
      datecreated: data?.dateTime,
    };

    await pool.query("INSERT INTO Notification VALUES ($1, $2, $3, $4, $5)", [
      likeMsgPayload.id,
      likeMsgPayload.photo,
      likeMsgPayload.message,
      likeMsgPayload.logtype,
      likeMsgPayload.datecreated,
    ]);
    console.log("Friend notifications added successfully");
  } catch (error) {
    console.log(error);
  }
};
