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
  user: UserInterface,
  groups: any
}

interface UserInterface{
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
  const [isLoading, setIsLoading] = useState(true)

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


  }, [])

  useEffect(() => {
    if(graphData?.user?.mail !== undefined) {
      let groups: string[] = [];
      graphData.groups?.value.forEach((g:any) => {
        groups.push(g.displayName)
      });
      console.log(groups)
      const data = {
        mail: graphData.user.mail,
        roles: groups
      }
      fetch(process.env.REACT_APP_API_SERVER + "/user/addUserRoles.php", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'no-cors', // no-cors, *cors, same-origin
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      })
      .then(response => response.json)
      .then(data => console.log(data))
    }
    setIsLoading(false)
  }, [graphData])


  if (!isAuthenticated) return (
      <SignIn />
  ) 

  if (isLoading) return (
    <p>Loading</p>
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
          <Route path="installningar" element={<>Inställningar</>}></Route>
          <Route path="*" element={<>404</>}></Route>
        </Routes>
        </div>
        </div>
      </GraphContext.Provider>
    </BrowserRouter>
  );
}

export default App;
