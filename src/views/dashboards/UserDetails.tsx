import TitleHelmet from '@/components/Common/TitleHelmet'
import { Card } from 'react-bootstrap'

const UserDetails = () => {
  return (
    <>
      <TitleHelmet title="User Details" />
      <Card className="flex-grow-1">
        <Card.Body className="d-flex align-items-center justify-content-center">
          <div className="display-4 opacity-25">User Details</div>
        </Card.Body>
      </Card>
    </>
  )
}

export default UserDetails
