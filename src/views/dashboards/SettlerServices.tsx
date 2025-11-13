import PageBreadcrumbButton from '@/components/Common/PageBreadcrumbButton'
import { Button, Stack, Table } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '@/components/UiElements/Base/Avatars/Avatar'
import { fetchSettlerServicesWithUsers, SettlerServicesWithUsers } from '@/services/SettlerServiceServices'

const SettlerServices = () => {
  const [settlerServices, setSettlerServices] = useState<SettlerServicesWithUsers[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await fetchSettlerServicesWithUsers()
      setSettlerServices(data)
    }
    load()
  }, [])



  return (
    <>
      <PageBreadcrumbButton title="Bookings" subName="Dashboard" />
      {/* Start:: Col */}
      <Table responsive hover className="mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Service Provider Services</th>
            <th>Service Provider</th>
            <th>Ratings</th>
            <th>Status</th>
            <th>Updated At</th>
            <th className="text-end">Action</th>
          </tr>
        </thead>
        <tbody>
          {settlerServices.map((service) => (
            <tr key={service.id}>
              <td>
                <Link to="">{service.id!.substring(0, 8)}...</Link>
              </td>
              <td>
                <Stack direction="horizontal" gap={3}>
                  <Link to="" className="d-block">
                    {service.selectedCatalogue.title.substring(0, 17)}...
                    <span className="fs-13 fw-normal text-muted d-block">
                      {service.selectedCatalogue.id?.substring(0, 14)}...
                    </span>
                  </Link>
                </Stack>
              </td>
              <td>
                <div className="hstack">
                  <Avatar
                    size="md"
                    type="image"
                    src={service.settler?.profileImageUrl|| 'https://placeholder.pics/svg/300'}
                    alt={service.settler?.firstName}
                  />
                  <Link to="" className="ms-3">
                    {service.settler?.firstName} {service.settler?.lastName}
                    <span className="fs-13 fw-normal text-muted d-block">
                      {service.settlerId?.substring(0, 10)}...
                    </span>
                  </Link>
                </div>
              </td>
              <td>{service.averageRatings ?? '-'}</td>
              <td>
                <span className={`badge rounded-pill ${service.isActive ? 'bg-success' : 'bg-secondary'}`}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                {service.updatedAt?.toDate().toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </td>
              <td className="text-end">
                <Link to={`/dashboards/settler-service/${service.id}`}>
                  <Button variant="primary">
                    View
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table >
      {/* End:: Col */}
    </>
  )
}

export default SettlerServices
