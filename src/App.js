import { BrowserRouter as Router, 
          Route,
          //Link
        } from "react-router-dom";
import Games from './components/Games';
import Header from './components/Header';
import Streams from './components/Streams';
import GameStreams from './components/GameStreams';
import './App.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

function App() {
  return (
    <Router>
      <Header />
      <Route exact path='/' component={Games} />
      <Route exact path='/top-streams' component={Streams} />
      <Route exact path='/game/:id' component={GameStreams} />
    </Router>
  );
}

export default App;