import { Suspense, ReactNode } from 'react'
import { PreloaderFull } from '@/components/Misc/Preloader'

interface AuthLayoutProps {
  children?: ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {

  return (
    <Suspense fallback={<PreloaderFull />}>
      <Suspense fallback={<div />}>
        <div className="wrapper">{children}</div>
      </Suspense>

      {/* <Stack
        className="support-livechat-btn position-fixed z-1"
        style={{ bottom: '2rem', right: '2rem' }}
      >
        {showLiveChat ? (
          <Button onClick={handleSupportLiveChat} variant="primary" className="btn-lg btn-icon">
            <i className="fi fi-rr-cross-small fs-20"></i>
          </Button>
        ) : (
          <Button
            onClick={handleSupportLiveChat}
            variant="primary"
            className="btn-lg rounded-5 w-100"
          >
            <i className="fi fi-rr-dot-circle fs-12"></i>
            <span className="ms-2">Live Chat</span>
          </Button>
        )}
      </Stack> */}
    </Suspense>
  )
}

export default AuthLayout
