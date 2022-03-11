import {useState, useEffect, createContext} from 'react';
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from '../../authConfig';
import { callMsGraph } from "../../graph";
import SignIn from '../SignIn/SignIn';
import Header from '../Header/Header';
import Overview from '../Views/Quick_overview';

interface GraphContextInterface {
  user: {
    businessPhones: []
    displayName: string
    givenName: string
    id: string
    jobTitle: string
    mail: string
    mobilePhone: string
    officeLocation: string
    preferredLanguage: string
    surname: string
    userPrincipalName: string
  }
  groups: any
}

export const GraphContext = createContext({} as GraphContextInterface)

function App() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState({} as GraphContextInterface);

  useEffect(() => {

    const request = {
      ...loginRequest,
      account: accounts[0]
  };
    
    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance.acquireTokenSilent(request).then(async (response) => {
      await callMsGraph(response.accessToken).then(response => setGraphData(response));
}).catch((e) => {
    instance.acquireTokenPopup(request).then(async (response) => {
        await callMsGraph(response.accessToken).then(response => setGraphData(response));
      });
    });

  }, [instance, accounts])

  // for development,
  // see all groups user is member of in console.log as well as the graph data
  if (graphData.groups != undefined ) {
    console.log(graphData)
    let groups: string[] = [];
    graphData.groups?.value.forEach((g:any) => {
      groups.push(g.displayName)
    });
    console.log(groups)
  }

  if (!isAuthenticated) return (
      <SignIn />
  ); 
   
  return (
    <GraphContext.Provider value={graphData}>
      <Header></Header>
      <Overview></Overview>
    </GraphContext.Provider>
  );
};

export default App;
