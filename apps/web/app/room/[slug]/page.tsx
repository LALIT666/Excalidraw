import axios from "axios";
import { BACKEND_URL } from "../../../lib/config";
import { ChatRoom } from "../../../components/ChatRoom";

async function getRoomId(slug: string) {
  const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
  console.log(`[response data] ${response.data}`);
  return response.data.room.id;
}

export default async function ChattingRoom({
  params,
}: {
  params: { slug: string };
}) {
  const slug = (await params).slug;
  const roomId = await getRoomId(slug);

  return <ChatRoom id={roomId} />;
}
