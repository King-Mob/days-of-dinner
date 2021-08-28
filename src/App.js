import './App.css';
import {useState, useEffect} from 'react';
import {DateTime} from 'luxon';

const App = ({user}) => {
  const [days, setDays] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const loadDays = async () => {
    const response = await fetch(`https://days-of-dinner.herokuapp.com/days/${user.id}`);

    const data = await response.json();

    if(data.success){
        setDays(data.data);
        setLoaded(true);
    }
  };

  useEffect(()=>{
    if(!loaded)
      loadDays();
  });

  const changeDay = (i) => {
    let newDays = Array.from(days);
    days[i].status = days[i].status === "in"? "out" : "in";
    setDays(newDays);

    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user.id,
        day: {
          date: (DateTime.now().set({weekday: i + 1})).toJSDate(),
          status: days[i].status
        }
      })
    }

    console.log(request.body)

    fetch(`https://days-of-dinner.herokuapp.com/days/`,request)
    .then(()=>loadDays());
  }

  return (
    <div className="App">
        <h1>
          Days of Dinner | {user.name}
        </h1>
        {days.map((day,i) => 
          <div 
            key={i} 
            className={"day-container " + day.status}
            onClick={()=>changeDay(i)}
          >
             <p>{day.name}</p>
             <p>{day.status}</p>
          </div>)}
    </div>
  );
}

export default App;
