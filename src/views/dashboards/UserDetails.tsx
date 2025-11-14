import TitleHelmet from '@/components/Common/TitleHelmet'
import { Card, Row, Col, Badge } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchSelectedUser, User } from '@/services/UserServices'
import { fetchUserPayments, Payment } from '@/services/PaymentServices'
import { Address, fetchUserAddresses } from '@/services/AddressServices'
import PageBreadcrumb from '@/components/Common/PageBreadcrumb'
const UserDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<User>()
  const [payments, setPayments] = useState<Payment[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const fetchedUser = await fetchSelectedUser(id!)
        if (fetchedUser) {
          setUser(fetchedUser)

          // fetch payment
          const fetchedPayments = await fetchUserPayments(id!)
          if (fetchedPayments.length > 0) {
            setPayments(fetchedPayments)
          }

          // fetch address
          const fetchedAddresses = await fetchUserAddresses(id!)
          if (fetchedAddresses.length > 0) {
            setAddresses(fetchedAddresses)
          }

          setLoading(false)
        } else {
          throw new Error('User not found')
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user:', error)
        setLoading(false)
      }
    }

    if (id) {
      load()
    }
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <>
      <TitleHelmet title="User Details" />
      <PageBreadcrumb title="User Details" subName="Dashboard" />
      <Row className="g-3">
        {/* User Information Card */}
        <Col xs={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">User Information</h5>
            </Card.Header>
            <Card.Body>
                <Row>
                <Col md={3} className="text-center mb-3 mb-md-0">
                  <img 
                  src={user.profileImageUrl || 'https://placeholder.pics/svg/300'} 
                  alt={`${user.firstName} ${user.lastName}`}
                  className="rounded-circle img-fluid"
                  style={{ maxWidth: '150px', width: '100%' }}
                  />
                </Col>
                <Col md={4}>
                  <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                  <p><strong>Username:</strong> {user.userName}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phoneNumber}</p>
                </Col>
                <Col md={5}>
                  <p><strong>Account Type:</strong> {user.accountType}</p>
                  <p><strong>Member For:</strong> {user.memberFor}</p>
                  <p>
                  <strong>Status:</strong>{' '}
                  <Badge bg={user.isActive ? 'success' : 'danger'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  </p>
                  <p>
                  <strong>Verified:</strong>{' '}
                  <Badge bg={user.isVerified ? 'success' : 'warning'}>
                    {user.isVerified ? 'Verified' : 'Not Verified'}
                  </Badge>
                  </p>
                </Col>
                </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Payment Method Card */}
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Payment Methods</h5>
            </Card.Header>
            <Card.Body>
              {payments.length > 0 ? (
              payments.map((payment) => (
                <Card key={payment.id} className="mb-3">
                <Card.Body>
                <div className="mb-2">
                  {user.currentPayment?.id === payment.id && (
                    <Badge bg="primary">Current Payment Method</Badge>
                  )}
                </div>
                  <p><strong>Account Holder:</strong> {payment.accountHolder}</p>
                  <p><strong>Card Number:</strong> {payment.accountNumber}</p>
                  <p><strong>Expiry Date:</strong> {payment.bankName}</p>
                  <p className="mb-0"><strong>Account Type:</strong> {payment.accountType}</p>
                </Card.Body>
                </Card>
              ))
              ) : (
              <p className="text-muted">No payment methods on file</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Address Card */}
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Addresses</h5>
            </Card.Header>
            <Card.Body>
              {addresses.length > 0 ? (
              addresses.map((address) => (
                <Card key={address.id} className="mb-3">
                <Card.Body>
                  <div className="mb-2">
                  {user.currentAddress?.id === address.id && (
                    <Badge bg="primary">Current Address</Badge>
                  )}
                </div>
                  <p><strong>Latitude:</strong> {address.latitude}</p>
                  <p><strong>Longitude:</strong> {address.longitude}</p>
                  <p><strong>Street:</strong> {address.address}</p>
                  <p><strong>City:</strong> {address.addressLabel}</p>
                  <p><strong>State:</strong> {address.fullAddress}</p>
                  <p className="mb-0"><strong>Zip Code:</strong> {address.postcode}</p>
                </Card.Body>
                </Card>
              ))
              ) : (
              <p className="text-muted">No addresses on file</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default UserDetails
