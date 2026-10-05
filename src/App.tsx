import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Footer, ContactActions, ScrollManager } from './components/Layout';
import { SampleReportProvider } from './components/SampleReport';
import { MotionPreferencesProvider } from './components/MotionPreferences';
import { ButtonLink, Eyebrow } from './components/UI';
import { SEO } from './seo';
import { serviceLandingPages, legacyRedirects } from './routes';
import Home from './pages/Home';
import About from './pages/About';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import BookInspection from './pages/BookInspection';
import Pricing from './pages/Pricing';
import Privacy from './pages/Privacy';

export default function App() {
  return (
    <MotionPreferencesProvider>
      <SampleReportProvider>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <SEO />
        <ScrollManager />
        <Navbar />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/book-inspection" element={<BookInspection />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy" element={<Privacy />} />
            {Object.entries(legacyRedirects).map(([from, to]) => (
              <Route key={from} path={from} element={<Navigate to={to} replace />} />
            ))}
            {serviceLandingPages.map((page) => (
              <Route
                key={page.path}
                path={page.path}
                element={<ServiceDetailPage serviceId={page.serviceId} />}
              />
            ))}
            <Route
              path="*"
              element={
                <section className="section not-found">
                  <div className="container">
                    <Eyebrow>404 / A DETAIL OUT OF PLACE</Eyebrow>
                    <h1>This page isn’t on the plan.</h1>
                    <p>Let’s get you back to a clearer view of your property.</p>
                    <ButtonLink to="/" variant="dark">
                      Back to home
                    </ButtonLink>
                  </div>
                </section>
              }
            />
          </Routes>
        </main>
        <Footer />
        <ContactActions />
      </SampleReportProvider>
    </MotionPreferencesProvider>
  );
}
