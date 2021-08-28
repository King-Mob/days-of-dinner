import './App.css';
import {useState, useEffect} from 'react';
import {DateTime} from 'luxon';

const App = ({user}) => {
  const [days, setDays] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [more, setMore] = useState(-1);

  console.log(more)

  const loadDays = async () => {
    const response = await fetch(`https://days-of-dinner.herokuapp.com/days/user/${user.id}`);

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

  let modalActive = more >= 0? "active" : "inactive";

  return (
    <div className="App">
        <div className={"modal " + modalActive}>
          <h2>More info</h2>
          <p onClick={()=>setMore(-1)}>close</p>
        </div>
        <h1>
          Days of Dinner | {user.name}
        </h1>
        {days.map((day,i) => 
        <div key={i} className="row">
          <div 
            className={"day-container " + day.status}
            onClick={()=>changeDay(i)}
          >
             <p>{day.name}</p>
             <p>{day.status}</p>
          </div>
          <p 
            className="button in-line"
            onClick={()=>setMore(i)}
          >
            see more
          </p>
        </div>)}
    </div>
  );
}

export default App;
