import { Route, Routes } from 'react-router'
import { Layout } from './components/layout/Layout'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import GoneHome from './pages/GoneHome'
import HappyFamilies from './pages/HappyFamilies'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import NotFound from './pages/NotFound'
import Puppies from './pages/Puppies'
import Puppy from './pages/Puppy'

/** Every page and its web address */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="puppies" element={<Puppies />} />
        <Route path="puppies/:slug" element={<Puppy />} />
        <Route path="happy-families" element={<HappyFamilies />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="faq" element={<Faq />} />
        <Route path="contact" element={<Contact />} />
        <Route path="gone-home" element={<GoneHome />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
