import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { GamePage as LightsOutGame } from './games/lights-out/LightsOutGame';
import { LightsOutInstructions } from './games/lights-out/LightsOutInstructions';
import { WallArchitectGame } from './games/wall-architect/WallArchitectGame';

function App() {

  return (
    (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="game/lights-out" element={<LightsOutInstructions />} />
            <Route path="game/lights-out/play" element={<LightsOutGame />} />
            <Route path="game/wall-architect" element={<WallArchitectGame />} />
          </Route>
        </Routes>
      </BrowserRouter>
    )
  );

}

export default App;
