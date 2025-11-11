import PageBreadcrumbButton from '@/components/Common/PageBreadcrumbButton'
import { Row, Col, Card, Table } from 'react-bootstrap'
import type { Booking } from "../../services/BookingServices"
import { fetchBookings } from "../../services/BookingServices"
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await fetchBookings()
      setBookings(data)
    }
    load()
  }, [])

  return (
    <>
      <PageBreadcrumbButton
        title="Bootstrap"
        subName="Tables"
        url={'https://react-bootstrap.netlify.app/docs/components/table'}
      />
      <Row className="g-3 g-md-4">
        {/* Start:: Col */}
        <Col xs={12}>
          <Card>
            <Card.Header>
              <Card.Title>Hoverable</Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>Customer</th>
                    <th>Service Provider</th>
                    <th>Booked Services</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((data, idx) => (
                    <tr key={idx}>
                      <td>{data.id!.substring(0, 5)}...</td>
                      <td>{data.firstName} {data.lastName}</td>
                      <td>{data.settlerId ? `${data.settlerFirstName} ${data.settlerLastName} (${data.settlerId!.substring(0, 5)}...)` : 'None'}</td>
                      <td>{data.catalogueService.title.substring(0, 17)}...</td>
                      <td>RM{data.total.toFixed(2)}</td>
                      <td>{data.status}</td>
                        <td>
                        {data.createAt?.seconds != null
                          ? new Date(data.createAt.seconds * 1000).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          }) + ' | ' + new Date(data.createAt.seconds * 1000).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                          : 'N/A'}
                        </td>
                      <td className="text-end">
                        <Link to={`/bookings/${data.id}`} className="btn btn-sm btn-primary">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </Table>
            </Card.Body>
          </Card>
        </Col>
        {/* End:: Col */}
      </Row>
    </>
  )
}

export default Bookings
