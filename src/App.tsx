import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { Analytics } from "@vercel/analytics/react"
import { GameBox } from './games/GameBox';

function App() {

  return (
    (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="game/:slug" element={<GameBox />} />
          </Route>
        </Routes>
        <Analytics />
      </BrowserRouter>
    )
  );

}

export default App;
