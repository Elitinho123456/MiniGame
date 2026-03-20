import { createBrowserRouter } from 'react-router';

//Pages
import Error from '../pages/Error';
import Home from '../pages/Home';
import Game from '../pages/Game';

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
    element: <Game />,
  },
]);

export default router;
