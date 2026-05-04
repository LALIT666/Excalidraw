import axios from "axios";
import { BACKEND_URL } from "../../lib/config";

export default async function Signup() {
  const response = await axios.post(`${BACKEND_URL}/auth/signup`);
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
      <label htmlFor="">
        username
        <input type="text" placeholder="john doe" />
      </label>
    </div>
  );
}
