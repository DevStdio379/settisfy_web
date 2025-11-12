import PageBreadcrumbButton from '@/components/Common/PageBreadcrumbButton'
import { Button, Stack, Table } from 'react-bootstrap'
import type { BookingWithUsers } from "../../services/BookingServices"
import { fetchBookingsWithUsers } from "../../services/BookingServices"
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '@/components/UiElements/Base/Avatars/Avatar'

const Bookings = () => {
  const [bookings, setBookings] = useState<BookingWithUsers[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await fetchBookingsWithUsers()
      setBookings(data)
    }
    load()
  }, [])



  return (
    <>
      <PageBreadcrumbButton
        title="Service Bookings"
        subName="Service Bookings"
        url={'https://react-bootstrap.netlify.app/docs/components/table'}
      />
      {/* Start:: Col */}
      <Table responsive hover className="mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Service Provider</th>
            <th>Booked Service</th>
            <th>Total</th>
            <th>Status</th>
            <th className="text-end">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>
                <Link to="">{booking.id!.substring(0, 8)}...</Link>
              </td>
              <td>
                <div className="hstack">
                  <Avatar
                    size="md"
                    type="image"
                    src={booking.customer?.profileImageUrl || ''}
                    alt={booking.firstName}
                  />
                  <Link to="" className="ms-3">
                    {booking.firstName} {booking.lastName}
                    <span className="fs-13 fw-normal text-muted d-block">
                      {booking.userId.substring(0, 10)}...
                    </span>
                  </Link>
                </div>
              </td>
              <td>
                {booking.settlerId ? (
                  <div className="hstack">
                    <Avatar
                      size="md"
                      type="image"
                      src={booking.settler?.profileImageUrl || 'https://via.placeholder.com/150'}
                      alt={booking.settler?.firstName || 'Settler'}
                    />
                    <Link to="" className="ms-3">
                      {booking.settler?.firstName || 'N/A'} {booking.settler?.lastName || ''}
                      <span className="fs-13 fw-normal text-muted d-block">
                        {booking.settler?.uid?.substring(0, 10) || 'N/A'}...
                      </span>
                    </Link>
                  </div>
                ) : (
                  <span className="text-muted">None</span>
                )}
              </td>
              <td>
                <Stack direction="horizontal" gap={3}>
                  <Link to="" className="d-block">
                    {booking.catalogueService.title.substring(0, 17)}...
                    <span className="fs-13 fw-normal text-muted d-block">
                      {booking.catalogueService.id?.substring(0, 14)}...
                    </span>
                  </Link>
                </Stack>
              </td>
              <td>
                <span className="text-muted" >
                  RM{booking.total.toFixed(2)}
                </span>
              </td>
              <td>
                <span className="text-muted">
                  {booking.status}
                </span>
              </td>
              <td className="text-end">
                <Button variant="primary">
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table >
      {/* End:: Col */}
    </>
  )
}

export default Bookings
