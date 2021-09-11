import GridTable from './components/GridTable';
import GraphTable from './components/GraphTable';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
       <p>Pathfinding app</p>
      </header>
      {/* <GridTable/> */}
      <GraphTable/>
    </div>
  );
}

export default App;
