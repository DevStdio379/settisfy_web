import { Stack } from 'react-bootstrap'
import PageBreadcrumb from './PageBreadcrumb'

interface PageTitleProps {
  subName?: string
  title: string
  url?: string
}

const PageBreadcrumbButton = ({ title, subName, url }: PageTitleProps) => {
  return (
    <Stack direction="horizontal" className="justify-content-between">
      <PageBreadcrumb title={title} subName={subName} />
      <Stack gap={2} direction="horizontal" className="mt-2 mb-4 mb-md-6">
        {/* optional buttons can go here */}
      </Stack>
    </Stack>
  )
}

export default PageBreadcrumbButton
