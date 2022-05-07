import React from 'react'

type Props = {
  roles: number[] | boolean
}

const icons = [
  "local_police",
  "table_restaurant",
  "soup_kitchen",
  "supervisor_account",
  "person"
]

//

function UserRoles({roles}: Props) {
  let rolesBool: Array<Boolean> = []

  // checks what permissions a user has but with bools

  if (!Array.isArray(roles)) {
    rolesBool = new Array(5).fill(false)
  } else {
    for (let i = 0; i < 5; i++) {
      if ((roles as Array<number>).includes(i+1)) {
        rolesBool.push(true)
      } else {
        rolesBool.push(false)
      }
    }
  }


  // renders icons for each role if user has them
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