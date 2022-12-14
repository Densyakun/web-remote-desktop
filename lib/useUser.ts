import useSWR from "swr";
import { User } from "../pages/api/user";

export default function useUser() {
  const { data: user, mutate: mutateUser } = useSWR<User>("/api/user");

  return { user, mutateUser };
}
