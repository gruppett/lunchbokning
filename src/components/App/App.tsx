import {useState, useEffect, createContext} from 'react';
import SignIn from '../SignIn/SignIn';
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from '../../authConfig';
import { callMsGraph } from "../../graph";
import Header from '../Header/Header';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Nav from '../Nav/Nav';


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

    if (!isAuthenticated) {
      return
    }

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

  }, [instance, accounts, isAuthenticated])

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
  ) 
   
  return (
    <BrowserRouter>
      <GraphContext.Provider value={graphData}>
        <div className='flex'>

        <Nav></Nav>
        <div className="flex-grow">
        <Header></Header>
        <Routes>
          <Route path="/" element={<>Översikt</>}></Route>
          <Route path="personlig" element={<>Personligt</>}></Route>
          <Route path="grupper" element={<>Grupper</>}></Route>
          <Route path="externa-grupper" element={<>Externa grupper</>}></Route>
          <Route path="sammanstallning" element={<>Sammanställning</>}></Route>
          <Route path="*" element={<>404</>}></Route>
        </Routes>
        </div>
        </div>
      </GraphContext.Provider>
    </BrowserRouter>
  );
}

export default App;
