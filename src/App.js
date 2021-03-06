import "./App.css";
import { useState, useEffect } from "react";
import { DateTime } from "luxon";

const App = ({ user }) => {
  const [days, setDays] = useState([]);
  const [daysUsers, setDaysUsers] = useState([]);
  const [day, setDay] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [more, setMore] = useState(-1);

  const loadDays = async () => {
    const response = await fetch(
      `https://days-of-dinner.herokuapp.com/days/user/${user.id}`
    );

    const data = await response.json();

    if (data.success) {
      setDays(data.data);
      setLoaded(true);
    }
  };

  const loadDaysUsers = async () => {
    const response = await fetch(`https://days-of-dinner.herokuapp.com/days`);

    const data = await response.json();

    if (data.success) {
      setDaysUsers(data.data);
    }
  };

  const loadDay = async (more) => {
    const response = await fetch(
      `https://days-of-dinner.herokuapp.com/days/${more}`
    );

    const data = await response.json();

    if (data.success) {
      setDay(data.data);
    }
  };

  useEffect(() => {
    if (!loaded) {
      loadDaysUsers();
      loadDays();
    }
  });

  useEffect(() => {
    if (more >= 0) loadDay(more);
    else setDay([]);
  }, [more]);

  const changeDay = (i) => {
    let newDays = Array.from(days);

    switch (days[i].status) {
      case "in":
        newDays[i].status = "back later";
        break;
      case "back later":
        newDays[i].status = "out";
        break;
      default:
        newDays[i].status = "in";
    }

    setDays(newDays);

    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        day: {
          date: DateTime.now()
            .set({ weekday: i + 1 })
            .toJSDate(),
          status: days[i].status,
        },
      }),
    };

    fetch(`https://days-of-dinner.herokuapp.com/days/`, request).then(() => {
      loadDays();
      loadDaysUsers();
    });
  };

  let pageContent = days.map((day, i) => (
    <div key={i} className="row">
      <div className="info-container">
        <div className="name-container">
          {daysUsers[i] &&
            Object.keys(daysUsers[i].users).map((name) => (
              <div
                key={name + i}
                className={"name " + daysUsers[i].users[name]}
              >
                {name}
              </div>
            ))}
        </div>
        <p className="button in-line" onClick={() => setMore(i)}>
          more
        </p>
      </div>
      <div
        className={"day-container " + day.status}
        onClick={() => changeDay(i)}
      >
        <p>{day.date}</p>
        <p>{day.status}</p>
      </div>
    </div>
  ));

  if (more >= 0) {
    pageContent = (
      <div>
        <h2>{days[more].date}</h2>
        {day.length === 0 && <p>loading, please wait</p>}
        {day.map((user, i) => (
          <p key={i}>
            {user.name} is {user.status}
          </p>
        ))}
        <p className="button" onClick={() => setMore(-1)}>
          close
        </p>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Days of Dinner | {user.name}</h1>
      {days.length === 0 && <p>loading, please wait</p>}
      {pageContent}
    </div>
  );
};

export default App;
