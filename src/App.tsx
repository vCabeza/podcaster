import { RouterProvider } from 'react-router-dom'
import { LoadingProvider } from './application/context/LoadingContext'
import { router } from './presentation/routes/router'

function App() {
  return (
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>
  )
}

export default App
