import { useState, useEffect, createContext } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { callMsGraph } from "../../graph";
import Page from "../Page/Page";
import { BrowserRouter } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import SignIn from "../SignIn/SignIn";


interface GraphContextInterface {
  user: UserInterface;
  groups: any;
}

interface ApiUserContextInterface {
  servingID: number;
  employeeID: number;
  employeeEmail: string;
  diet: number;
  roles: number[];
}
interface ApiUserContextProviderInterface {
  userData: ApiUserContextInterface;
  setUserData: Function;
}

interface UserInterface {
  businessPhones: [];
  displayName: string;
  givenName: string;
  id: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
}

const allowedGroups = [
  "M365-DAT19Projektgrupp1",
  "ayg-personal-s1",
  "ag-itavdelningen",
  "ayg-larare-s1",
];

export const GraphContext = createContext({} as GraphContextInterface);
export const UserContext = createContext({} as ApiUserContextProviderInterface);

function handleLogout(instance: any) {
  instance.logoutRedirect().catch((e: any) => {
    console.error(e);
  });
}

function App() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState({} as GraphContextInterface);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnprivileged, setIsUnprivileged] = useState(false);
  const [userData, setUserData] = useState({} as ApiUserContextInterface);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const request = {
      ...loginRequest,
      account: accounts[0],
    };

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance
      .acquireTokenSilent(request)
      .then(async (response) => {
        await callMsGraph(response.accessToken).then((response) =>
          setGraphData(response)
        );
      })
      .catch((e) => {
        instance.acquireTokenPopup(request).then(async (response) => {
          await callMsGraph(response.accessToken).then((response) =>
            setGraphData(response)
          );
        });
      });
  }, [isAuthenticated, accounts, instance]);

  useEffect(() => {
    if (graphData?.user?.mail !== undefined) {
      let groups: string[] = [];
      graphData.groups?.value.forEach((g: any) => {
        groups.push(g.displayName);
      });
      let isOk = false;
      allowedGroups.forEach((element) => {
        if (groups.includes(element)) {
          isOk = true;
        }
      });
      if (!isOk) {
        setIsUnprivileged(true);
        return;
      }

      const data = {
        employeeEmail: graphData.user.mail,
        roles: groups,
      };
      fetch(process.env.REACT_APP_API_SERVER + "user/getLogin.php", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      })
        .then((response) => response.json())
        .then((data) => setUserData(data));
    }
  }, [graphData]);

  useEffect(() => {
    if (graphData?.user?.mail !== undefined) {
      setIsLoading(false);
    }
  }, [graphData]);

  if (!isAuthenticated) return <SignIn />;

  if (isUnprivileged)
    return (
      <div className="flex justify-center gap-3 items-center h-full flex-col">
        <h1>Du har inte tillgång till lunchbokningen</h1>
        <button onClick={() => handleLogout(instance)}></button>
      </div>
    );

  if (isLoading) {
    return (
      <div className="h-screen">
        <Spinner />
      </div>
    );
  }
  return (
    <BrowserRouter>
      <GraphContext.Provider value={graphData}>
        <UserContext.Provider value={{userData, setUserData}}>
          <Page></Page>
        </UserContext.Provider>
      </GraphContext.Provider>
    </BrowserRouter>
  );
}

export default App;
