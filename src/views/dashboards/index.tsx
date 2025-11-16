import PageBreadcrumb from '@/components/Common/PageBreadcrumb'
import TitleHelmet from '@/components/Common/TitleHelmet'
import { Card } from 'react-bootstrap'

const Ecommerce = () => {
  return (
    <>
      <PageBreadcrumb title="eCommerce" subName="Dashboards" />
      <TitleHelmet title="Starter Page" />
      <Card className="flex-grow-1">
        <Card.Body className="d-flex align-items-center justify-content-center">
            <div className="display-4 opacity-25">Work in Progress for Dashboard</div>
        </Card.Body>
      </Card>
    </>
  )
}

export default Ecommerce
