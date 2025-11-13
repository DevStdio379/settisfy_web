import PageBreadcrumbButton from '@/components/Common/PageBreadcrumbButton'
import { Button, Table } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '@/components/UiElements/Base/Avatars/Avatar'
import { Catalogue, fetchAllCatalogue } from '@/services/CatalogueServices'

const Catalogues = () => {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await fetchAllCatalogue()
      setCatalogues(data)
    }
    load()
  }, [])



  return (
    <>
      <PageBreadcrumbButton title="Catalogue" subName="Dashboard" />
      <div className="d-flex justify-content-end mb-3">
        <Link to="/dashboards/catalogues/new">
          <Button variant="primary">
            <i className="fi fi-rr-add me-2"></i>
            Add New Service
          </Button>
        </Link>
      </div>
      {/* Start:: Col */}
      <Table responsive hover className="mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Base Price</th>
            <th>Warranty Period</th>
            <th>Ratings</th>
            <th>Status</th>
            <th>Updated At</th>
            <th className="text-end">Action</th>
          </tr>
        </thead>
        <tbody>
          {catalogues.map((catalogue) => (
            <tr key={catalogue.id}>
              <td>
                <Link to="">{catalogue.id!.substring(0, 8)}...</Link>
              </td>
              <td>
                <div className="hstack">
                  <Avatar
                    size="md"
                    type="image"
                    src={catalogue.imageUrls[0] || ''}
                    alt={catalogue.title}
                  />
                    <div className="ms-3">
                      <Link to="">{catalogue.title}</Link>
                      <div className="text-muted small">{catalogue.category}</div>
                    </div>
                </div>
              </td>
              <td>
                RM{catalogue.basePrice}
              </td>
              <td>
                {catalogue.category}
              </td>
              <td>
                {catalogue.coolDownPeriodHours} Hours
              </td>
              <td>
                {catalogue.isActive ? (
                  <span className="badge bg-success">Active</span>
                ) : (
                  <span className="badge bg-danger">Inactive</span>
                )}
              </td>
              <td>
                {catalogue.averageRatings.toFixed(1)}★ ({catalogue.bookingsCount})
              </td>
              <td>
                {catalogue.updateAt?.toDate().toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </td>
              <td className="text-end">
                <Link to={`/dashboards/catalogues/${catalogue.id}`}>
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

export default Catalogues
