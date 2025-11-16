import { Suspense, ReactNode } from 'react'
import { PreloaderFull } from '@/components/Misc/Preloader'
import PublicHeader from './Public/PublicHeader'
import PublicFooter from './Public/PublicFooter'

interface PublicLayoutProps {
  children?: ReactNode
}

const PublicLayout = ({ children }: PublicLayoutProps) => {

  return (
    <Suspense fallback={<PreloaderFull />}>
      <Suspense fallback={<div />}>
        <div className="wrapper">
          <PublicHeader />
          <Suspense fallback={<div />}>{children}</Suspense>
          <PublicFooter />
        </div>
      </Suspense>
    </Suspense>
  )
}

export default PublicLayout
