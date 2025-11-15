import PageBreadcrumb from '@/components/Common/PageBreadcrumb'
import TitleHelmet from '@/components/Common/TitleHelmet'
import { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { fetchSystemParameters, SystemParameter, updateSystemParameters } from '@/services/SystemParameterServices'

const SystemParameters = () => {
  const [parameters, setParameters] = useState<SystemParameter>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const load = async () => {
      const data = await fetchSystemParameters()

      if (data) {
        setParameters(data)
      }
    }
    load()
  }, [])

  const handleValueChange = (field: keyof SystemParameter, value: number | string) => {
    if (field === 'platformFee' && typeof value === 'number') {
      setParameters(prev => prev ? { ...prev, [field]: value } : undefined)
    } else if (typeof value === 'string') {
      setParameters(prev => prev ? { ...prev, [field]: value } : undefined)
    }
  }

  const handleToggleChange = (field: keyof SystemParameter, checked: boolean) => {
    setParameters(prev => prev ? { ...prev, [field]: checked } : undefined)
  }

  return (
    <>
      <TitleHelmet title="Parameters" />
      <PageBreadcrumb title="Parameters" subName="Dashboard" />
      <Card className="flex-grow-1">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">System Parameters</h5>
          <button className="btn btn-primary btn-sm" disabled={loading} onClick={async () => {
            if (parameters) {
              setLoading(true)
              await updateSystemParameters(parameters)
              setLoading(false)
            }
          }}>
            {loading ? 'Updating...' : 'Update Parameters'}
          </button>
        </Card.Header>
        <Card.Body>
          <div className="list-group">
            {/* Example parameter items */}
            <div className="list-group-item">
              <div className="row align-items-center">
                <div className="col-9">
                  <h6 className="mb-1">Platform Fee (RM)</h6>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="0.00"
                    value={parameters?.platformFee ?? ''}
                    onChange={(e) => handleValueChange('platformFee', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="col-3 d-flex justify-content-end align-items-center">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="param1"
                      checked={parameters?.platformFeeIsActive}
                      onChange={(e) => handleToggleChange('platformFeeIsActive', e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <h6 className="mt-5">For Apple Reviewing Only</h6>
            <div className="list-group-item">
              <div className="row align-items-center">
                <div className="col-9">
                  <h6 className="mb-1">[OVERRIDE] Show Admin Approve Booking Button</h6>
                </div>
                <div className="col-3 d-flex justify-content-end align-items-center">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="showAdminApproveBookingButton"
                      checked={parameters?.showAdminApproveBookingButton}
                      onChange={(e) => handleToggleChange('showAdminApproveBookingButton', e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="list-group-item">
              <div className="row align-items-center">
                <div className="col-9">
                  <h6 className="mb-1">[OVERRIDE] Show Assign Settler Button</h6>
                </div>
                <div className="col-3 d-flex justify-content-end align-items-center">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="showAssignSettlerButton"
                      checked={parameters?.showAssignSettlerButton}
                      onChange={(e) => handleToggleChange('showAssignSettlerButton', e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <h6 className="mt-5">For Customer Support</h6>
            <div className="list-group-item">
              <div className="row align-items-center">
                <div className="col-12">
                  <h6 className="mb-1">FAQs Link</h6>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Enter FAQs link"
                    value={parameters?.faqLink ?? ''}
                    onChange={(e) => handleValueChange('faqLink', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="list-group-item">
              <div className="row align-items-center">
                <div className="col-9">
                  <h6 className="mb-1">Customer Support Link</h6>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Enter Customer Support link"
                    value={parameters?.customerSupportLink ?? ''}
                    onChange={(e) => handleValueChange('customerSupportLink', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}

export default SystemParameters
