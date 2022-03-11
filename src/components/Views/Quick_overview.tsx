import React,{ useContext, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { GraphContext } from '../App/App';


function Overview() {
    const [value, onChange] = useState(new Date());
    const {user} = useContext(GraphContext)

    return (
        <Calendar
          onChange={onChange}
          value={value}
          minDetail="year"
          onClickDay={
            (value, event) => 
            console.log(value)
          }
          tileContent = {
            ({ date, view }) => view === 'month' && date.getDay() === 2 ? <p className="bg-blue-500">{user?.givenName}</p> : null
          }
        />
    );
};

export default Overview;