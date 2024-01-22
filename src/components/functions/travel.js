import axios from "axios";

export const create = async (data) =>
  await axios.post("http://localhost:8000/locations", data);

export const list = async () =>
  await axios.get("http://localhost:8000/locations");
