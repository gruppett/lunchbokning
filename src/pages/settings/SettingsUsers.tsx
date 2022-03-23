import React, {useState} from 'react'
import UserRoles from '../../components/UserRoles/UserRoles'

const dummyUserData = [
  {
    mail: "Jimmy.Jansson@gymnasium.ax",
    id: 1,
    roles: [
      1, 2, 3, 4,
    ],
    groups: [
      "DAT32",
      "MERK32"
    ]
  },
  {
    mail: "Simmy.Sansson@gymnasium.ax",
    id: 2,
    roles: [
      2, 3, 4,
    ],
    groups: [
      "MERK32"
    ]
  },
  {
    mail: "Kimmy.Kansson@gymnasium.ax",
    id: 3,
    roles: [
      2, 4,
    ],
    groups: []
  }
]



function SettingsUsers() {
  const [selectedUser, setSelectedUser] = useState(-1)
  const [isUserSelected, setIsUserSelected] = useState(false)
  function selectUser (id: number) {
    setSelectedUser(id)
    setIsUserSelected(true)
  }


  return (
    <div className='flex gap-3 flex-col p-3 bg-slate-50 sm:w-max'>
      <div className='flex gap-3 items-start sm:flex-wrap flex-col sm:flex-row'>
      <div>
        <h2>Användare</h2>
        <table className='text-left border-collapse'>
          <thead>
            <tr className='bg-white'>
              <th className='p-1 border'>E-post</th>
              <th colSpan={4} className='p-1 border'>Roller</th>
            </tr>
          </thead>
          <tbody>
            {dummyUserData.map((d, i) => (
              <tr key={i} className="cursor-pointer bg-white hover:bg-slate-100 even:bg-slate-50" onClick={() => selectUser(i)}>
                <td className='p-1 border'>{d.mail}</td>
                <UserRoles roles={d.roles}></UserRoles>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex gap-1 flex-col'>
        <h2>Lägg till</h2>
        <label htmlFor="userMail">E-post</label>
        <input type="text" name="userMail" id="userMail" className='p-1'/>
        <button className='px-3 py-1 w-min whitespace-nowrap bg-blue-300'>Lägg till</button>
      </div>
      </div>
      {isUserSelected
      ?<div className='flex flex-col gap-1'>
        <h2>{dummyUserData[selectedUser].mail}</h2>
        <div className='flex gap-1 items-baseline'>
          <input type="checkbox" name="userIsAdmin" id="userIsAdmin" checked={dummyUserData[selectedUser].roles.includes(1)}/>
          <label htmlFor="userIsAdmin" className='cursor-pointer flex'>Är adminstratör
            <span className='material-icons-outlined self.center'>
              local_police
            </span>
          </label>
        </div>
        <div className='flex gap-1 items-baseline'>
          <input type="checkbox" name="userIsHallTeacher" id="userIsHallTeacher" checked={dummyUserData[selectedUser].roles.includes(2)}/>
          <label htmlFor="userIsHallTeacher" className='cursor-pointer flex'>Är salslärare
            <span className='material-icons-outlined self.center'>
            table_restaurant
            </span>
          </label>
        </div>
        <div className='flex gap-1 items-baseline'>
          <input type="checkbox" name="userIsKitchenTeacher" id="userIsKitchenTeacher" checked={dummyUserData[selectedUser].roles.includes(3)}/>
          <label htmlFor="userIsKitchenTeacher" className='cursor-pointer flex'>Är köksärare
            <span className='material-icons-outlined self.center'>
            soup_kitchen
            </span>
          </label>
        </div>
        <button className='px-3 py-1 w-min whitespace-nowrap bg-blue-300'>Spara</button>
      </div>
      :<></>}
    </div>
  )
}

export default SettingsUsers