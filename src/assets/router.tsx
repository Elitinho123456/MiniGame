import { createBrowserRouter } from 'react-router';

//Pages
import Error from '../pages/Error';
import Home from '../pages/Home';
import Game from '../pages/Game';
import Teste from '../pages/teste';

//Documentation
import Documentation from '../pages/docs/Documentation';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: '/documentation',
    element: <Documentation />,
  },
  {
    path: '/game',
    element: <Game />, // Placeholder para a página do jogo
  },
  {
    path: '/teste',
    element: <Teste />, // Placeholder para a página do jogo
  },
]);

export default router;
