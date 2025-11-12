import PageBreadcrumbButton from '@/components/Common/PageBreadcrumbButton'
import { Button, Card, Col, Row, Stack, Table } from 'react-bootstrap'
import type { AcceptorsWithDetails, Booking } from "../../services/BookingServices"
import { BookingActivityType, fetchBookingById, updateBooking } from "../../services/BookingServices"
import type { BookingStatus } from "@/utils/status"
import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Avatar from '@/components/UiElements/Base/Avatars/Avatar'
import { fetchListOfUsers, fetchSelectedUser, User } from '@/services/UserServices'
import { fetchListOfSettlerServices, SettlerService } from '@/services/SettlerServiceServices'
import { getStatusBadgeClass, getStatusLabel } from '@/utils/status'

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [booking, setBooking] = useState<Booking>()
  const [acceptors, setAcceptors] = useState<AcceptorsWithDetails[]>()
  const [customer, setCustomer] = useState<User>()
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const load = async () => {
      if (id) {
        try {
          // for fetching booking details
          const data = await fetchBookingById(id)
          if (data) {
            setBooking(data)
          }

          // for fetching customer details
          if (data?.userId) {
            const customerData = await fetchSelectedUser(data.userId)
            setCustomer(customerData || undefined)
          }

          // for fetching acceptors details
          let listOfAcceptors: User[] = []
          let listOfSettlerServices: SettlerService[] = []

          if (data?.acceptors) {
            listOfAcceptors = await fetchListOfUsers(data.acceptors.map(a => a.settlerId))
            listOfSettlerServices = await fetchListOfSettlerServices(data.acceptors.map(a => a.settlerServiceId))

            // set acceptors with details
            setAcceptors(data?.acceptors.map(acceptor => {
              const settlerDetails = listOfAcceptors.find(user => user.uid === acceptor.settlerId)
              const serviceDetails = listOfSettlerServices.find(service => service.id === acceptor.settlerServiceId)

              return {
                ...acceptor,
                settler: settlerDetails,
                service: serviceDetails
              }
            }) || [])
          }
        } catch (error) {
          console.error('Error fetching booking:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    load()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!booking) return <div>Booking not found</div>


  return (
    <>
      <PageBreadcrumbButton title="Booking Details" subName="Bookings" />
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white border-bottom-0">
          <Stack direction="horizontal" gap={3}>
            <h5 className="mb-0 fw-semibold">#{booking.id} | {booking.catalogueService.title}</h5>
            <span className={`badge ${getStatusBadgeClass(booking.status as BookingStatus)}`}>
              {getStatusLabel(booking.status as BookingStatus)}
            </span>
            <div className="ms-auto d-flex gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => { if (id) navigate(`/dashboards/bookings/${id}/timeline`) }}
              >
                Timeline
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => navigate('/dashboards/bookings')}
              >
                Back to List
              </Button>
            </div>
          </Stack>
        </Card.Header>
        <Card.Body>
          {/* Action Buttons */}
          <Row className="mb-4">
            <Col>
              {booking.status === 0.1 && (
                <Card className="border-0 shadow-sm" style={{ backgroundColor: '#dc354515' }}>
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <i className="ri-alert-line text-danger" style={{ fontSize: '24px' }}></i>
                        <div>
                          <h6 className="mb-1 fw-semibold">Action Required</h6>
                          <p className="mb-0 text-muted small">Review and validate this booking details & proof of payment. Once approved, this booking will be broadcasted.</p>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          disabled={loading}
                          onClick={async () => {
                            setLoading(true)
                            try {
                              await updateBooking(booking.id!, { status: 0 })
                              window.location.reload()
                            } catch (error) {
                              console.error('Error updating booking:', error)
                              setLoading(false)
                            }
                          }}
                        >
                          <i className="ri-check-line me-1"></i>
                          {loading ? 'Submitting...' : 'Valid Booking'}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => console.log('Invalidate booking:', booking.id)}
                        >
                          <i className="ri-close-line me-1"></i>
                          Invalid Booking
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
          {/* Customer & Booking Info */}
          <Row className="g-4 mb-4">
            <Col md={6}>
              <Card className="h-100 shadow-sm border-0 bg-light-subtle">
                <Card.Body>
                  <h5 className="fw-semibold mb-3">Booking Information</h5>
                  <Row>
                    <Col md={6}>
                      <div className="d-flex flex-column gap-3">
                        <div>
                          <label className="text-muted fs-6 fw-bold">Customer Name:</label>
                          <div className="fw-medium">{customer?.firstName} {customer?.lastName}</div>
                        </div>
                        <div>
                          <label className="text-muted fs-6 fw-bold">Email:</label>
                          <div className="fw-medium">{customer?.email}</div>
                        </div>
                        <div>
                          <label className="text-muted fs-6 fw-bold">Service Address:</label>
                          <div className="fw-medium">{booking.selectedAddress.fullAddress || '-'}</div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6} className="border-start border-2" style={{ borderColor: '#495057 !important' }}>
                      <div>
                        <label className="text-muted fs-6 mb-2 fw-bold">Proof of Payment:</label>
                        {booking.paymentEvidence && booking.paymentEvidence.length > 0 ? (
                          <div className="d-flex gap-2 flex-wrap">
                            {booking.paymentEvidence.map((url, idx) => (
                              <a key={idx} href={url} target="_blank" rel="noopener noreferrer" title="Open full image">
                                <img
                                  src={url}
                                  alt={`Payment Evidence ${idx + 1}`}
                                  style={{
                                    width: '150px',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '6px',
                                    border: '1px solid #dee2e6',
                                    cursor: 'pointer'
                                  }}
                                />
                              </a>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted">No payment evidence provided</div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 shadow-sm border-0 bg-light-subtle">
                <Card.Body>
                  <h5 className="fw-semibold mb-3">Notes to Service Provider</h5>
                  {booking.notesToSettlerImageUrls?.length ? (
                    <div className="mb-2">
                      <div className="d-flex gap-2 flex-wrap">
                        {booking.notesToSettlerImageUrls.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Note image ${idx + 1}`}
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: '6px'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <h6 className="fw-semibold mb-3">Notes to Service Provider</h6>
                  <div className="form-control" style={{ minHeight: '60px', backgroundColor: '#f8f9fa', cursor: 'default', fontSize: '0.875rem' }}>
                    {booking.notesToSettler || <span className="text-muted">No notes provided</span>}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="g-4">
            <Col md={6}>
              <Card className="h-100 shadow-sm border-0 bg-light-subtle">
                <Card.Body>
                  <h5 className="fw-semibold mb-3">Pricing Breakdown</h5>
                  <Table borderless size="sm">
                    <tbody>
                      <tr>
                        <td><strong>Base Price:</strong></td>
                        <td className="text-end">RM{booking.catalogueService?.basePrice}</td>
                      </tr>
                      {booking.addons && booking.addons.map((addon) =>
                        addon.subOptions
                          .filter(opt => opt.isCompleted)
                          .map((opt) => (
                            <tr key={`${addon.name}-${opt.label}`}>
                              <td>{addon.name}: {opt.label}</td>
                              <td className="text-end">RM{Number(opt.additionalPrice || 0).toFixed(2)}</td>
                            </tr>
                          ))
                      )}
                      <tr>
                        <td><strong>Platform Fee:</strong></td>
                        <td className="text-end">RM2.00</td>
                      </tr>
                      {booking.manualQuoteDescription && Number(booking.manualQuotePrice) > 0 && (
                        <>
                          <tr>
                            <td><strong>Manual Quote:</strong></td>
                            <td className="text-end">RM{Number(booking.manualQuotePrice).toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td colSpan={2}>
                              <small className="text-muted">{booking.manualQuoteDescription}</small>
                            </td>
                          </tr>
                        </>
                      )}
                      <tr className="border-top">
                        <td><strong>Total:</strong></td>
                        <td className="text-end"><strong>RM{(
                          Number(booking.catalogueService?.basePrice || 0) +
                          (booking.addons?.reduce((sum, addon) =>
                            sum + addon.subOptions
                              .filter(opt => opt.isCompleted)
                              .reduce((s, opt) => s + Number(opt.additionalPrice || 0), 0)
                            , 0) || 0) +
                          2 +
                          (booking.manualQuoteDescription && Number(booking.manualQuotePrice) > 0
                            ? Number(booking.manualQuotePrice)
                            : 0)
                        ).toFixed(2)}</strong></td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 shadow-sm border-0 bg-light-subtle">
                <Card.Body>
                  <h5 className="fw-semibold mb-3">Service Completion Evidence</h5>
                  {booking.settlerEvidenceImageUrls?.length ? (
                    <div className="mb-3">
                      <div className="d-flex gap-2 flex-wrap">
                        {booking.settlerEvidenceImageUrls.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Evidence image ${idx + 1}`}
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: '6px'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* if no completion remark exist */}
                  {!booking.settlerEvidenceRemark && booking.settlerEvidenceRemark !== '' && (
                    <div className="form-control" style={{ minHeight: '80px', backgroundColor: '#f8f9fa', cursor: 'default', fontSize: '0.875rem' }}>
                      {booking.settlerEvidenceRemark || <span className="text-muted">No remark provided</span>}
                    </div>
                  )}
                  {/* if no incompletion report */}
                  {booking.settlerEvidenceImageUrls.length === 0 && booking.settlerEvidenceRemark === '' && (
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
                      <i className="ri-checkbox-circle-line text-success" style={{ fontSize: '48px' }}></i>
                      <p className="text-muted mt-2 mb-0">No service completion evidence provided</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Acceptors Section */}
          <Row className="mt-4">
            <Col>
              <Card className="shadow-sm border-0 bg-light-subtle">
                <Card.Body>
                  <h5 className="fw-semibold mb-3">Acceptors</h5>
                  {acceptors && acceptors.length > 0 ? (
                    <Table hover responsive>
                      <thead>
                        <tr>
                          <th>Service Provider</th>
                          <th>Service ID</th>
                          <th>Location</th>
                          <th>Ratings</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {acceptors.map(acc => (
                          <tr key={acc.settlerId}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <Avatar
                                  type="image"
                                  src={acc.settler?.profileImageUrl || 'https://via.placeholder.com/150'}
                                  alt={`${acc.settler?.firstName} ${acc.settler?.lastName}`}
                                  size="sm"
                                />
                                <span>{acc.settler?.firstName} {acc.settler?.lastName}</span>
                              </div>
                            </td>
                            <td>
                              <Link to={`/dashboards/settler-service/${acc.service?.id}`}>
                                <Button
                                  variant="link"
                                  className="text-decoration-underline text-primary d-flex align-items-center gap-1 p-0"
                                  onClick={() => navigate(`/profile/ServiceProfile/${acc.service?.id}`)}
                                >
                                  {acc.service?.id}
                                  <i className="ri-external-link-line"></i>
                                </Button>
                              </Link>
                            </td>
                            <td>{acc.service?.serviceLocation}</td>
                            <td>{acc.service?.averageRatings ?? '-'}</td>
                            <td>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => console.log('Accept acceptor:', acc.settlerId)}
                              >
                                Accept
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-muted mb-0">No available service provider</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={6}>
              <Card className="shadow-sm border-0 bg-light-subtle h-100">
                <Card.Body>
                  {/* Service Incompletion Report (by customer) */}
                  <h5 className="fw-semibold mb-3">Service Incompletion Report (by customer)</h5>
                  {booking.incompletionReportImageUrls?.length ? (
                    <div className="mb-3">
                      <div className="d-flex gap-2 flex-wrap">
                        {booking.incompletionReportImageUrls.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Incompletion image ${idx + 1}`}
                            style={{
                              width: '120px',
                              height: '120px',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {booking.incompletionReportRemark && (
                    <>
                      <h6>Incompletion Report Remark</h6>
                      <div className="form-control" style={{ minHeight: '80px', backgroundColor: '#f8f9fa', cursor: 'default' }}>
                        {booking.incompletionReportRemark}
                      </div>
                    </>
                  )}

                  {/* if settler plan to resolve incompletion issues */}
                  {booking.incompletionStatus === BookingActivityType.SETTLER_RESOLVE_INCOMPLETION && (
                    <>
                      <h5 className="fw-semibold mb-3">Incompletion Report Resolve Evidence (by settler)</h5>
                      {/* incompletion report */}
                      {booking.incompletionResolvedImageUrls?.length ? (
                        <div className="mb-3">
                          <div className="d-flex gap-2 flex-wrap">
                            {booking.incompletionResolvedImageUrls.map((url, idx) => (
                              <img
                                key={idx}
                                src={url}
                                alt={`Incompletion resolved image ${idx + 1}`}
                                style={{
                                  width: '120px',
                                  height: '120px',
                                  objectFit: 'cover',
                                  borderRadius: '8px'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {booking.incompletionResolvedRemark && (
                        <>
                          <h6>Incompletion Report Resolve Remark</h6>
                          <div className="form-control" style={{ minHeight: '80px', backgroundColor: '#f8f9fa', cursor: 'default' }}>
                            {booking.incompletionResolvedRemark}
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* if settler reject incompletion report */}
                  {booking.incompletionStatus === BookingActivityType.SETTLER_REJECT_INCOMPLETION && (
                    <>
                      <p className="text-muted mt-2 mb-0">Service provider has rejected the incompletion report.</p>
                    </>
                  )}

                  {/* if no incompletion report */}
                  {!booking.incompletionReportImageUrls?.length && !booking.incompletionReportRemark && (
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
                      <i className="ri-checkbox-circle-line text-success" style={{ fontSize: '48px' }}></i>
                      <p className="text-muted mt-2 mb-0">No incompletion report</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm border-0 bg-light-subtle h-100">
                <Card.Body>
                  <h5 className="fw-semibold mb-3">Warranty Period Report (by customer)</h5>
                  {/* warranty period report */}
                  {booking.cooldownReportImageUrls?.length ? (
                    <div className="mb-3">
                      <div className="d-flex gap-2 flex-wrap">
                        {booking.cooldownReportImageUrls.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Incompletion image ${idx + 1}`}
                            style={{
                              width: '120px',
                              height: '120px',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {booking.cooldownReportRemark && (
                    <>
                      <h6>Warranty Period Report Remark</h6>
                      <div className="form-control" style={{ minHeight: '80px', backgroundColor: '#f8f9fa', cursor: 'default' }}>
                        {booking.cooldownReportRemark}
                      </div>
                    </>
                  )}

                  {/* if settler plan to resolve warranty period issues */}
                  {booking.cooldownStatus === BookingActivityType.SETTLER_RESOLVE_COOLDOWN_REPORT && (
                    <>
                      <h5 className="fw-semibold mb-3">Warranty Period Report Resolve Evidence (by settler)</h5>
                      {/* warranty period report */}
                      {booking.cooldownResolvedImageUrls?.length ? (
                        <div className="mb-3">
                          <div className="d-flex gap-2 flex-wrap">
                            {booking.cooldownResolvedImageUrls.map((url, idx) => (
                              <img
                                key={idx}
                                src={url}
                                alt={`Incompletion image ${idx + 1}`}
                                style={{
                                  width: '120px',
                                  height: '120px',
                                  objectFit: 'cover',
                                  borderRadius: '8px'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {booking.cooldownResolvedRemark && (
                        <>
                          <h6>Warranty Period Report Remark</h6>
                          <div className="form-control" style={{ minHeight: '80px', backgroundColor: '#f8f9fa', cursor: 'default' }}>
                            {booking.cooldownResolvedRemark}
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* if settler reject warranty period report */}
                  {booking.cooldownStatus === BookingActivityType.SETTLER_REJECT_COOLDOWN_REPORT && (
                    <>
                      <p className="text-muted mt-2 mb-0">Service provider has rejected the warranty period report.</p>
                    </>
                  )}

                  {/* No warranty period report */}
                  {!booking.cooldownReportImageUrls?.length && !booking.cooldownReportRemark && (
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
                      <i className="ri-checkbox-circle-line text-success" style={{ fontSize: '48px' }}></i>
                      <p className="text-muted mt-2 mb-0">No warranty period report</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  )
}

export default BookingDetails
