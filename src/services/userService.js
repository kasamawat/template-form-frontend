import api from "./api";

export const getUsers = async () => {
  const res = await api.get(`/Users`);
  return res.data;
};

export const createUser = async (user) => {
    const res = await api.post(`/Users`, user);
    return res.data;
};
