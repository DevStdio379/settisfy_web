// src/components/Common/PageBreadcrumb.tsx
import { Link, useLocation, useParams } from "react-router-dom"
import { Breadcrumb } from "react-bootstrap"

interface PageBreadcrumbProps {
  title?: string
  subName?: string
}

const PageBreadcrumb = ({ title, subName }: PageBreadcrumbProps) => {
  const location = useLocation()
  const params = useParams<{ bookingId?: string }>()

  const pathnames = location.pathname.split("/").filter((x) => x)

  return (
    <Breadcrumb className="mb-3">
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
        Home
      </Breadcrumb.Item>

      {pathnames.map((name, index) => {
        const routeTo = "/" + pathnames.slice(0, index + 1).join("/")
        const isLast = index === pathnames.length - 1

        const displayName =
          name === "dashboards"
            ? "Dashboard"
            : name === "bookings"
            ? "Bookings"
            : params.bookingId
            ? `Booking #${params.bookingId}`
            : name

        return isLast ? (
          <Breadcrumb.Item key={name} active>
            {displayName}
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={name} linkAs={Link} linkProps={{ to: routeTo }}>
            {displayName}
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}

export default PageBreadcrumb
