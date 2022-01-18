import decode from "jwt-decode";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { destroyCookie, parseCookies } from "nookies";

import { AuthTokenError } from "../services/errors/AuthTokenError";
import { validateUserAccessLevel } from "../utils/validadeUserAccessLevel";

function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  requiredAccessLevel?: string,
): GetServerSideProps {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const token = cookies["baruiApp.token"];

    if (!token) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const user = decode<{ accessLevel: string }>(token);

    if (requiredAccessLevel) {
      const userHasValidAccessLevel = validateUserAccessLevel({
        userAccessLevel: user.accessLevel,
        requiredAccessLevel,
      });

      if (!userHasValidAccessLevel) {
        return {
          redirect: {
            destination: "/dashboard",
            permanent: false,
          },
        };
      }
    }

    try {
      const resultFn = await fn(ctx);
      return resultFn;
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(ctx, "baruiApp.token");
        destroyCookie(ctx, "baruiApp.refreshToken");

        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }

      return error;
    }
  };
}

export { withSSRAuth };
