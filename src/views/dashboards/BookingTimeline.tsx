import PageBreadcrumbButton from '@/components/Common/PageBreadcrumbButton'
import { Button, Stack, Table } from 'react-bootstrap'
import type { Booking, BookingWithUsers } from "../../services/BookingServices"
import { BookingActivityType, fetchBookingById, fetchBookingsWithUsers } from "../../services/BookingServices"
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Avatar from '@/components/UiElements/Base/Avatars/Avatar'

const getReadableType = (type?: BookingActivityType, message?: string) => {
  const map: Record<string, string> = {
    // initial booking state
    [BookingActivityType.QUOTE_CREATED]: 'Quote Created',
    [BookingActivityType.NOTES_TO_SETTLER_UPDATED]: 'Notes to Settler Updated',
    [BookingActivityType.SETTLER_ACCEPT]: 'Settler Accepted',
    [BookingActivityType.SETTLER_SELECTED]: 'Settler Selected',

    // active service state
    [BookingActivityType.SETTLER_SERVICE_START]: 'Service Started',
    [BookingActivityType.SETTLER_SERVICE_END]: 'Service Completed',
    [BookingActivityType.SETTLER_EVIDENCE_SUBMITTED]: 'Completion Evidence Submitted',
    [BookingActivityType.SETTLER_EVIDENCE_UPDATED]: 'Completion Evidence Updated',

    // incompletion state
    [BookingActivityType.JOB_COMPLETED]: 'Customer marked job as completed',
    [BookingActivityType.JOB_INCOMPLETE]: 'Customer marked job as incomplete',
    [BookingActivityType.CUSTOMER_JOB_INCOMPLETE_UPDATED]: 'Customer updated incompletion report',
    [BookingActivityType.CUSTOMER_REJECT_INCOMPLETION_RESOLVE]: 'Customer rejected incompletion resolution',
    [BookingActivityType.SETTLER_RESOLVE_INCOMPLETION]: 'Settler choose to resolve incompletion',
    [BookingActivityType.SETTLER_UPDATE_INCOMPLETION_EVIDENCE]: 'Settler updated incompletion resolution evidence',
    [BookingActivityType.SETTLER_REJECT_INCOMPLETION]: 'Settler rejected incompletion report',
    [BookingActivityType.CUSTOMER_CONFIRM_COMPLETION]: 'Customer confirmed completion',

    // cooldown state
    [BookingActivityType.COOLDOWN_REPORT_SUBMITTED]: 'Cooldown report submitted',
    [BookingActivityType.CUSTOMER_COOLDOWN_REPORT_UPDATED]: 'Customer updated cooldown report',
    [BookingActivityType.SETTLER_RESOLVE_COOLDOWN_REPORT]: 'Settler choose to resolve cooldown report',
    [BookingActivityType.SETTLER_UPDATE_COOLDOWN_REPORT_EVIDENCE]: 'Settler updated cooldown evidence',
    [BookingActivityType.CUSTOMER_COOLDOWN_REPORT_NOT_RESOLVED]: 'Customer marked cooldown resolution as not resolved',
    [BookingActivityType.COOLDOWN_REPORT_COMPLETED]: 'Cooldown report completed',
    [BookingActivityType.SETTLER_REJECT_COOLDOWN_REPORT]: 'Settler rejected cooldown report',

    // final booking state
    [BookingActivityType.BOOKING_COMPLETED]: 'Booking completed',

  };
  return map[type ?? ''] || message || 'Activity';
};

const BookingTimeline = () => {
  const [booking, setBooking] = useState<Booking>()
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const load = async () => {
      const data = await fetchBookingById(id!)
      if (data) {
        setBooking(data)
      }
    }
    load()
  }, [])

  return (
    <>
      <PageBreadcrumbButton title="Booking Timeline" subName="Dashboard" />
      <div className="container-fluid">
        {booking && booking.timeline && booking.timeline.length > 0 ? (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-4">Activity Timeline</h5>
                  {booking.timeline.slice().reverse().map((item, index) => (
                    <div key={index} className="d-flex mb-3">
                      <div className="me-3">
                        <div
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: item.actor === 'SETTLER' ? '#0d6efd' : '#fd7e14',
                            marginTop: '6px'
                          }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className="card mb-2">
                          <div className="card-body">
                            <p className="card-subtitle text-muted">{new Date(Number(item.timestamp)).toLocaleString()}</p>
                            <p className="card-text fw-semibold">{getReadableType(item.type, item.message)}</p>

                            {/* Notes to Settler */}
                            {item.notesToSettlerImageUrls && item.notesToSettlerImageUrls.length > 0 && (
                              <div className="mt-2">
                                <div className="d-flex flex-wrap gap-2">
                                  {item.notesToSettlerImageUrls.map((url: string, imgIndex: number) => (
                                    <a key={imgIndex} href={url} target="_blank" rel="noopener noreferrer">
                                      <img
                                        src={url}
                                        alt={`Note attachment ${imgIndex + 1}`}
                                        style={{
                                          width: '100px',
                                          height: '100px',
                                          objectFit: 'cover',
                                          borderRadius: '4px',
                                          cursor: 'pointer'
                                        }}
                                      />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            {item.notesToSettler && (
                              <div className="mt-2">
                                <small className="text-muted">Notes: {item.notesToSettler}</small>
                              </div>
                            )}

                            {/* Completion Evidence Submission */}
                            {item.settlerEvidenceImageUrls && item.settlerEvidenceImageUrls.length > 0 && (
                              <div className="mt-2">
                                <div className="d-flex flex-wrap gap-2">
                                  {item.settlerEvidenceImageUrls.map((url: string, imgIndex: number) => (
                                    <a key={imgIndex} href={url} target="_blank" rel="noopener noreferrer">
                                      <img
                                        src={url}
                                        alt={`Evidence attachment ${imgIndex + 1}`}
                                        style={{
                                          width: '100px',
                                          height: '100px',
                                          objectFit: 'cover',
                                          borderRadius: '4px',
                                          cursor: 'pointer'
                                        }}
                                      />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            {item.settlerEvidenceRemark && (
                              <div className="mt-2">
                                <small className="text-muted">Remark: {item.settlerEvidenceRemark}</small>
                              </div>
                            )}

                            {/* Incompletion Report */}
                            {item.incompletionReportImageUrls && item.incompletionReportImageUrls.length > 0 && (
                              <div className="mt-2">
                                <div className="d-flex flex-wrap gap-2">
                                  {item.incompletionReportImageUrls.map((url: string, imgIndex: number) => (
                                    <a key={imgIndex} href={url} target="_blank" rel="noopener noreferrer">
                                      <img
                                        src={url}
                                        alt={`Incompletion attachment ${imgIndex + 1}`}
                                        style={{
                                          width: '100px',
                                          height: '100px',
                                          objectFit: 'cover',
                                          borderRadius: '4px',
                                          cursor: 'pointer'
                                        }}
                                      />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            {item.incompletionReportRemark && (
                              <div className="mt-2">
                                <small className="text-muted">Remark: {item.incompletionReportRemark}</small>
                              </div>
                            )}

                            {/* Incompletion Resolve Evidence */}
                            {item.incompletionResolvedImageUrls && item.incompletionResolvedImageUrls.length > 0 && (
                              <div className="mt-2">
                                <div className="d-flex flex-wrap gap-2">
                                  {item.incompletionResolvedImageUrls.map((url: string, imgIndex: number) => (
                                    <a key={imgIndex} href={url} target="_blank" rel="noopener noreferrer">
                                      <img
                                        src={url}
                                        alt={`Incompletion Resolved attachment ${imgIndex + 1}`}
                                        style={{
                                          width: '100px',
                                          height: '100px',
                                          objectFit: 'cover',
                                          borderRadius: '4px',
                                          cursor: 'pointer'
                                        }}
                                      />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            {item.incompletionResolvedRemark && (
                              <div className="mt-2">
                                <small className="text-muted">Remark: {item.incompletionResolvedRemark}</small>
                              </div>
                            )}

                            {/* Cooldown Report */}
                            {item.cooldownReportImageUrls && item.cooldownReportImageUrls.length > 0 && (
                              <div className="mt-2">
                                <div className="d-flex flex-wrap gap-2">
                                  {item.cooldownReportImageUrls.map((url: string, imgIndex: number) => (
                                    <a key={imgIndex} href={url} target="_blank" rel="noopener noreferrer">
                                      <img
                                        src={url}
                                        alt={`Cooldown attachment ${imgIndex + 1}`}
                                        style={{
                                          width: '100px',
                                          height: '100px',
                                          objectFit: 'cover',
                                          borderRadius: '4px',
                                          cursor: 'pointer'
                                        }}
                                      />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            {item.cooldownReportRemark && (
                              <div className="mt-2">
                                <small className="text-muted">Remark: {item.cooldownReportRemark}</small>
                              </div>
                            )}

                            {/* Cooldown Resolve Evidence */}
                            {item.cooldownResolvedImageUrls && item.cooldownResolvedImageUrls.length > 0 && (
                              <div className="mt-2">
                                <div className="d-flex flex-wrap gap-2">
                                  {item.cooldownResolvedImageUrls.map((url: string, imgIndex: number) => (
                                    <a key={imgIndex} href={url} target="_blank" rel="noopener noreferrer">
                                      <img
                                        src={url}
                                        alt={`Cooldown Resolved attachment ${imgIndex + 1}`}
                                        style={{
                                          width: '100px',
                                          height: '100px',
                                          objectFit: 'cover',
                                          borderRadius: '4px',
                                          cursor: 'pointer'
                                        }}
                                      />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            {item.cooldownResolvedRemark && (
                              <div className="mt-2">
                                <small className="text-muted">Remark: {item.cooldownResolvedRemark}</small>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mt-5">
            <p className="text-muted">No activity recorded yet.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default BookingTimeline
