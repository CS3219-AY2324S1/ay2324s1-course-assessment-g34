import ProfilePage from "@/components/ProfilePage/ProfilePage";
import RouteGuard from "@/components/RouteGuard";
import { useAuthContext } from "@/contexts/AuthContext";
import { Role } from "@/utils/constants";
import Head from "next/head";

export default function Profile() {
  const { user } = useAuthContext();

  return (
    // <RouteGuard allowedRoles={[Role.ADMIN, Role.USER]}>
    <>
      <Head>
        <title>{user}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={`Profile and collaboration history of ${user}`} />
      </Head>
      <ProfilePage />
    </>
    // </RouteGuard>
  );
}
