import axios from "axios";
import { BACKEND_URL } from "../../lib/config";

export default async function Signin() {
  const response = await axios.post(`${BACKEND_URL}/auth/signin`);
  console.log("response data", response.data);
  return (
    <div>
      <label htmlFor="">
        Email
        <input type="text" placeholder="test@email" />
      </label>
      <label htmlFor="">
        Password
        <input type="text" placeholder="password" />
      </label>
    </div>
  );
}
