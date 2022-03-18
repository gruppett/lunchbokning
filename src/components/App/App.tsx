import { useState, useEffect, createContext } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { callMsGraph } from "../../graph";
import Page from "../Page/Page";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import SignIn from "../SignIn/SignIn";

interface GraphContextInterface {
  user: UserInterface;
  groups: any;
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

export const GraphContext = createContext({} as GraphContextInterface);

function App() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState({} as GraphContextInterface);
  const [isLoading, setIsLoading] = useState(true);

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
  }, [isAuthenticated]);

  useEffect(() => {
    if (graphData?.user?.mail !== undefined) {
      let groups: string[] = [];
      graphData.groups?.value.forEach((g: any) => {
        groups.push(g.displayName);
      });
      console.log(groups);
      const data = {
        mail: graphData.user.mail,
        roles: groups,
      };
      fetch(process.env.REACT_APP_API_SERVER + "/api/user/addUserRoles.php", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "no-cors", // no-cors, *cors, same-origin
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      })
        .then((response) => response.json)
        .then((data) => console.log(data));
    }
  }, [graphData]);

  useEffect(() => {
    if (graphData?.user?.mail !== undefined) {
      console.log(graphData.user.mail);
      setIsLoading(false);
    }
  }, [graphData]);

  if (!isAuthenticated) return <SignIn />;

  if (isLoading)
    return (
      <div className="h-screen">
        <Spinner />
      </div>
    );

  return (
    <BrowserRouter>
      <GraphContext.Provider value={graphData}>
        <Routes>
          <Route path="/" element={<Page component="Overview" />}></Route>*
          <Route
            path="personlig"
            element={<Page component="Personal" />}
          ></Route>
          <Route path="grupper" element={<Page component="Groups" />}></Route>
          <Route
            path="externa-grupper"
            element={<Page component="ExternalGroups" />}
          ></Route>
          <Route
            path="sammanstallning"
            element={<Page component="Compilation" />}
          ></Route>
          <Route
            path="installningar"
            element={<Page component="Settings" />}
          ></Route>
          <Route path="*" element={<Page component="FourOhFour" />}></Route>
        </Routes>
      </GraphContext.Provider>
    </BrowserRouter>
  );
}

export default App;
