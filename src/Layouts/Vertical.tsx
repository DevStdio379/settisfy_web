import { Preloader, PreloaderFull } from '@/components/Misc/Preloader'
import React, { Suspense } from 'react'


const Header = React.lazy(() => import('./Header'))
const Footer = React.lazy(() => import('./Footer'))
const Navigation = React.lazy(() => import('./Navigation'))
const Customizer = React.lazy(() => import('./Customizer/Customizer'))

interface VerticalLayoutProps {
  children?: any
}

const VerticalLayout = ({ children }: VerticalLayoutProps) => {
  return (
    <Suspense fallback={<div />}>
      <div className="wrapper">
        <Suspense fallback={<PreloaderFull />}>
          <Navigation />
        </Suspense>

        <Suspense fallback={<div />}>
          <Header />
        </Suspense>

        <main className="main-content">
          <div
            className={`inner-content ${
              location.pathname.startsWith('/apps/') ? 'apps-content' : ''
            }`}
          >
            <Suspense fallback={<Preloader />}> {children}</Suspense>
          </div>
        </main>

        {!['/apps/'].some((path) => location.pathname.startsWith(path)) && (
          <Suspense fallback={<div />}>
            <Footer />
          </Suspense>
        )}
      </div>

      <Suspense fallback={<div />}>
        <Customizer />
      </Suspense>
    </Suspense>
  )
}
export default VerticalLayout
