import {useState, useEffect, createContext} from 'react';
import SignIn from '../SignIn/SignIn';
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from '../../authConfig';
import { callMsGraph } from "../../graph";
import Header from '../Header/Header';

interface GraphContextInterface {
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
  console.log(graphData)


  if (!isAuthenticated) return (
      <SignIn />
  ) 
   
  return (
    <GraphContext.Provider value={graphData}>
      <Header></Header>
    </GraphContext.Provider>
  );
}

export default App;
