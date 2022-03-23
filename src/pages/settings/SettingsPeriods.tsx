import React, {useState} from 'react'

const dummyPeriodData = [
  {
    name: 1,
    from: "16.8.2021",
    to: "6.10.2021",
  },
  {
    name: 2,
    from: "7.10.2021",
    to: "30.11.2021",
  },
  {
    name: 3,
    from: "1.12.2021",
    to: "8.2.2022",
  },
  {
    name: 4,
    from: "9.2.2022",
    to: "7.4.2022",
  },
  {
    name: 5,
    from: "8.4.2022",
    to: "	3.6.2022",
  }
]

function SettingsPeriods() {
  const [selectedPeriod, setSelectedPeriod] = useState(-1)
  const [isPeriodSelected, setIsPeriodSelected] = useState(false)

  function selectPeriod (id: number) {
    setSelectedPeriod(id)
    setIsPeriodSelected(true)
  }

  

  return (
    <div className='flex gap-3 p-3 bg-slate-50 sm:w-max flex-col'>
      <div className="flex gap-3 items-start sm:flex-wrap flex-col sm:flex-row">
        <div>
          <h2>Perioder</h2>
          <table className='table-auto text-left border-collapse'>
            <thead>
              <tr className='bg-white'>
                <th className='p-1 border'>Namn</th>
                <th className='p-1 border'>Från</th>
                <th className='p-1 border'>Till</th>
              </tr>
            </thead>
            <tbody>
              {dummyPeriodData.map((d, i) => (
                <tr className="bg-white even:bg-slate-50 cursor-pointer hover:bg-slate-100" onClick={() => selectPeriod(i)} key={i}>
                  <td className='p-1 border'>{d.name}</td>
                  <td className='p-1 border'>{d.to}</td>
                  <td className='p-1 border'>{d.from}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='flex flex-col gap-1'>
          <h2>Lägg till / Ändra</h2>
          <label htmlFor="periodName">Namn</label>
          <input type="text" name="periodName" id="periodName" className='bg-white p-1'/>
          <label htmlFor="periodFrom">Från</label>
          <input type="date" name="periodFrom" id="periodFrom" className='bg-white p-1'/>
          <label htmlFor="periodTo">Till</label>
          <input type="date" name="periodTo" id="periodTo" className='bg-white p-1'/>
          <button className='px-3 py-1 w-min whitespace-nowrap bg-blue-300'>Spara</button>
        </div>
      </div>
      {isPeriodSelected
      ? <div className='min-content'>
      <button className='px-3 py-1 bg-red-500 hover:bg-opacity-60'>Radera period {selectedPeriod}</button>
    </div>
      :<p>Välj en period för att radera den.</p>}
    </div>
  )
}

export default SettingsPeriods