import './App.css';
import {useState} from 'react';
import {setCookie} from './cookies';

const Auth = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState();

  const tryLogin = async () => {
    try{
      const response = await fetch(`https://days-of-dinner.herokuapp.com/login/${code}`);
      const data = await response.json();

      if(data.success){
          setCookie("user-dod", JSON.stringify(data.data),900);
          window.reload();
      }
    }
    catch(error){
        console.log(error)
        setError(error.errormessage)
    }
  }

  return (
    <div className="Auth">
        <p>Enter login code</p>
        <br/>
        <input type="text" placeholder="x342-ze!98" value={code} onChange={e=>setCode(e.target.value)}>
        </input>
        <br/>
        <br/>
        <p className="button" onClick={tryLogin}>login</p>
        <br/>
        {error && <p>{error}</p>}
    </div>
  );
}

export default Auth;
