import { createThirdwebClient } from "thirdweb";
import { THIRDWEB_CLIENT_ID } from "./constants/env";

export const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});
