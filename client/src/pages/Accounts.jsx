import { useEffect, useState } from "react";
import Link from "../Link";
import { getLinkToken } from "../services/LinkService";

function Accounts() {
  const [linkToken, setLinkToken] = useState();

  const establishLink = async () => {
    const newLinkToken = await getLinkToken();
    setLinkToken(newLinkToken);
  };

  useEffect(() => {
    establishLink();
  }, []);

  return <>{linkToken && <Link linkToken={linkToken} />}</>;
}

export default Accounts;
