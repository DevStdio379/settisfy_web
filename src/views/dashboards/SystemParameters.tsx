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
            <h6 className="mt-5">Service Provider Resources</h6>
            <div className="list-group-item">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Resource</h6>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => {
                    const newTip = {
                      imageUri: '',
                      title: '',
                      description: '',
                      link: '',
                    }
                    setParameters(prev => prev ? {
                      ...prev,
                      settlerResources: [...(prev.settlerResources || []), newTip]
                    } : undefined)
                  }}
                >
                  <i className="mdi mdi-plus"></i> Add Tip
                </button>
              </div>
                <div className="row">
                  {parameters?.settlerResources?.map((tip, index) => (
                    <div key={index} className="col-12 mb-3">
                      <div className="border rounded p-3">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h6 className="mb-0">Tip #{index + 1}</h6>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              setParameters(prev => prev ? {
                                ...prev,
                                settlerResources: prev.settlerResources?.filter((_, i) => i !== index)
                              } : undefined)
                            }}
                          >
                            <i className="fi fi-rr-trash"></i>
                          </button>
                        </div>
                        <div className="row mb-2 align-items-center">
                          <label className="col-md-3 col-form-label">Image URL</label>
                          <div className="col-md-9">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Enter image URL"
                              value={tip.imageUri}
                              onChange={(e) => {
                                setParameters(prev => prev ? {
                                  ...prev,
                                  settlerResources: prev.settlerResources?.map((t, i) => i === index ? { ...t, imageUri: e.target.value } : t)
                                } : undefined)
                              }}
                            />
                          </div>
                        </div>
                        <div className="row mb-2 align-items-center">
                          <label className="col-md-3 col-form-label">Title</label>
                          <div className="col-md-9">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Enter title"
                              value={tip.title}
                              onChange={(e) => {
                                setParameters(prev => prev ? {
                                  ...prev,
                                  settlerResources: prev.settlerResources?.map((t, i) => i === index ? { ...t, title: e.target.value } : t)
                                } : undefined)
                              }}
                            />
                          </div>
                        </div>
                        <div className="row mb-0 align-items-start">
                          <label className="col-md-3 col-form-label">Description</label>
                          <div className="col-md-9">
                            <textarea
                              className="form-control form-control-sm"
                              placeholder="Enter description"
                              rows={2}
                              value={tip.description}
                              onChange={(e) => {
                                setParameters(prev => prev ? {
                                  ...prev,
                                  settlerResources: prev.settlerResources?.map((t, i) => i === index ? { ...t, description: e.target.value } : t)
                                } : undefined)
                              }}
                            />
                          </div>
                        </div>
                        <div className="row mb-2 align-items-center">
                          <label className="col-md-3 col-form-label">Link</label>
                          <div className="col-md-9">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Enter link"
                              value={tip.link ?? ''}
                              onChange={(e) => {
                                setParameters(prev => prev ? {
                                  ...prev,
                                  settlerResources: prev.settlerResources?.map((t, i) => i === index ? { ...t, link: e.target.value } : t)
                                } : undefined)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}

export default SystemParameters
