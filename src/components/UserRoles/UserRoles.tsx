import React from 'react'

type Props = {
  roles: number[]
}

const icons = [
  "local_police",
  "table_restaurant",
  "soup_kitchen",
  "supervisor_account"
]

function UserRoles({roles}: Props) {
  let rolesBool = []

  for (let i = 0; i < 4; i++) {
    if (roles.includes(i+1)) {
      rolesBool.push(true)
    } else {
      rolesBool.push(false)
    }
  }

  return (
    <>
      {rolesBool.map((i, key) => (
        <td key={key} className='p-1 border'>
          {i &&
          <span className='material-icons-outlined flex items-align justify-center'>
            {icons[key]}
          </span>
          }
        </td>
      ))}
    </>
  )
}

export default UserRoles