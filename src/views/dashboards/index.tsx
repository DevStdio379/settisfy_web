import PageDashBreadcrumb from '@/components/Common/PageDashBreadcrumb'
import {
  BestSellingCard,
  EarningBarCard,
  GrowthBarCard,
  PerformanceCard,
  RecentOrderList,
  SalesHistoryCard,
  SalesReportChart,
  StoreOverview,
  WeeklyStatsCard,
} from '@/components/Dashboards/Ecommerce'
import { Col, Row } from 'react-bootstrap'

const Ecommerce = () => {
  return (
    <>
      <PageDashBreadcrumb title="eCommerce" subName="Dashboards" />
      <Row className="g-3 g-md-4">
        <Col xl={4}>
          <PerformanceCard />
        </Col>
        <Col xl={4} lg={6}>
          <GrowthBarCard />
        </Col>
        <Col xl={4} lg={6}>
          <EarningBarCard />
        </Col>
        <Col xl={8}>
          <SalesReportChart />
        </Col>
        <Col xl={4}>
          <StoreOverview />
        </Col>
        <Col xl={4}>
          <WeeklyStatsCard />
        </Col>
        <Col xl={4}>
          <BestSellingCard />
        </Col>
        <Col xl={4}>
          <SalesHistoryCard />
        </Col>
        <Col xl={12}>
          <RecentOrderList />
        </Col>
      </Row>
    </>
  )
}

export default Ecommerce
