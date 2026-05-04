import axios from "axios";
import { BACKEND_URL } from "../../../lib/config";
import { ChatRoom } from "../../../components/ChatRoom";

async function getRoomId(rawSlug: string) {
  const response = await axios.get(`${BACKEND_URL}/room/${rawSlug}`);
  console.log(`[response data] ${response.data}`);
  return response.data.room.id;
}

export default async function ChattingRoom({
  params,
}: {
  params: { rawSlug: string };
}) {
  const slug = (await params).rawSlug;
  const roomId = await getRoomId(slug);

  return <ChatRoom id={roomId} />;
}
