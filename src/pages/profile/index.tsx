import DefaultPageAnimation from "@/components/Layouts/DefaultAnim";
import { Button } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import useSWR from "swr";

const loadData = (url: string) =>
  fetch(url).then((resp) => {
    console.log("RESP:", url, resp);
    if (resp.ok) {
      return resp.json() as Promise<any>;
    } else {
      return resp.json().then((error) => {
        throw error;
      });
    }
  });

export default function Profile() {
  const { data: session, status } = useSession();

  const loading = status === "loading";

  const { data: user, isValidating } = useSWR(`/api/userinfo`, (url) =>
    loadData(url)
  );

  const pathname = usePathname();

  return (
    <DefaultPageAnimation
      className="w-full h-full z-50 flex justify-center whitespace-nowrap 
      items-center text-3xl font-semibold bg-gradient-to-b 
      from-transparent
      dark:from-transparent/50  dark:to-neutral-800 to-neutral-200 backdrop-blur-3xl"
      keyChildren="profile"
    >
      {user ? (
        <div>
          <div>Your name is: {user.name}</div>
          <div>Email: {user.email}</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 justify-center items-center">
          <div>Your aren't signed in</div>
          <div className="w-full h-20 flex justify-center">
            <Button
              className="w-1/2"
              onPress={() => {
                signIn("zitadel", {
                  callbackUrl: pathname,
                });
              }}
            >
              Sign in
            </Button>
          </div>
        </div>
      )}
    </DefaultPageAnimation>
  );
}
