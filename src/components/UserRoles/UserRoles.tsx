import React from 'react'

type Props = {
  roles: number[] | boolean
}

const icons = [
  "local_police",
  "table_restaurant",
  "soup_kitchen",
  "supervisor_account"
]

function UserRoles({roles}: Props) {
  let rolesBool: Array<Boolean> = []

  if (roles as boolean === false) {
    rolesBool = new Array(4).fill(false)
  } else {
    for (let i = 0; i < 4; i++) {
      if ((roles as Array<number>).includes(i+1)) {
        rolesBool.push(true)
      } else {
        rolesBool.push(false)
      }
    }
  }

  console.log(rolesBool)

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