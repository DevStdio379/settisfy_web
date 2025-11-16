import PageBreadcrumbButton from '@/components/Common/PageBreadcrumbButton'
import { Button, Table } from 'react-bootstrap'
import type { User } from "../../services/UserServices"
import { fetchAllUsers } from "../../services/UserServices"
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '@/components/UiElements/Base/Avatars/Avatar'

const Users = () => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await fetchAllUsers()
      setUsers(data)
    }
    load()
  }, [])

  if (users.length === 0) {
    return (
      <>
        <PageBreadcrumbButton title="Users" subName="Dashboard" />
        <p>No users found.</p>
      </>
    )
  }

  return (
    <>
    <p></p>
      <PageBreadcrumbButton title="Users" subName="Dashboard" />
      {/* Start:: Col */}
      <Table responsive hover className="mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Created At</th>
            <th className="text-end">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td>
                <Link to="">{user.uid?.substring(0, 8)}...</Link>
              </td>
              <td>
                <div className="hstack">
                  <Avatar
                    size="md"
                    type="image"
                    src={user.profileImageUrl || 'https://placeholder.pics/svg/300'}
                    alt={user.firstName}
                  />
                  <Link to="" className="ms-3">
                    {user.firstName} {user.lastName}
                    <span className="fs-13 fw-normal text-muted d-block">
                      @{user.userName || 'N/A'}
                    </span>
                  </Link>
                </div>
              </td>
              <td>
                <span className="text-muted">{user.email}</span>
              </td>
              <td>
                <span className="text-muted">{user.phoneNumber || 'N/A'}</span>
              </td>
              <td>
                <span className="badge bg-info">{user.accountType || 'User'}</span>
              </td>
              <td>
                {user.createAt?.toDate().toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </td>
              <td className="text-end">
                <Link to={`/dashboards/users/${user.uid}`}>
                  <Button variant="primary">
                    View
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* End:: Col */}
    </>
  )
}

export default Users
