import PageBreadcrumbButton from '@/components/Common/PageBreadcrumbButton';
import TitleHelmet from '@/components/Common/TitleHelmet'
import { fetchSelectedReviews, Review, ReviewWithUsers } from '@/services/ReviewServices';
import { fetchSelectedSettlerService, SettlerService } from '@/services/SettlerServiceServices';
import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

const SettlerServiceProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [settlerService, setSettlerService] = useState<SettlerService>();
  const [reviews, setReviews] = useState<ReviewWithUsers[]>([]);

  useEffect(() => {
    const load = async () => {
      if (id) {
        // Fetch settler service details
        const data = await fetchSelectedSettlerService(id);
        setSettlerService(data || undefined);

        // Fetch reviews for the settler service
        const reviewsData = await fetchSelectedReviews(id);
        setReviews(reviewsData);
      }
    }
    load();
  }, []);

  return (
    <>
      <PageBreadcrumbButton title="" subName="" />
      <TitleHelmet title="Service Profile" />
      <Card className="flex-grow-1">
        <Card.Body>
          <div className="row">
            {/* Image Gallery */}
            <div className="col-md-6 mb-4">
              {settlerService?.serviceCardImageUrls && settlerService.serviceCardImageUrls.length > 0 ? (
                <>
                  <img
                    src={settlerService.serviceCardImageUrls[0]}
                    alt={settlerService.selectedCatalogue.title}
                    className="img-fluid rounded mb-2"
                    style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                  />
                  <div className="row g-2">
                    {settlerService.serviceCardImageUrls.slice(1).map((img, idx) => (
                      <div key={idx} className="col-6">
                        <img
                          src={img}
                          alt={`${settlerService.selectedCatalogue.title} ${idx + 2}`}
                          className="img-fluid rounded"
                          style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-muted">No images available</div>
              )}
            </div>

            {/* Service Info */}
            <div className="col-md-6">
              <h2>{settlerService?.selectedCatalogue.title}</h2>

              {/* Rating */}
              <div className="mb-3">
                <span className="text-warning fs-5 me-2">
                  {'★'.repeat(Math.floor(settlerService?.averageRatings || 0))}
                  {'☆'.repeat(5 - Math.floor(settlerService?.averageRatings || 0))}
                </span>
                <span className="text-muted">
                  {settlerService?.averageRatings} ({settlerService?.isActive} reviews)
                </span>
              </div>

              {/* Brief Description */}
              <p className="text-muted mb-4">{settlerService?.serviceCardBrief}</p>

              <div className="mb-3">
                <h5>Location</h5>
                <p>{settlerService?.serviceLocation}</p>
              </div>
              <div className="mb-3">
                <hr className="my-3 border-dark" />
                <h5 className="fw-bold">Job Preference</h5>
                <div className="mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="fs-5 mb-0">Available Immediately:</h6>
                      <span className="fs-5">{settlerService?.isAvailableImmediately ? 'Yes' : 'No'}</span>
                    </div>
                </div>
                <div className="mb-3">
                  <h6 className="fs-5">Available Days:</h6>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                  {settlerService?.availableDays && settlerService.availableDays.length > 0 ? (
                    settlerService.availableDays.map((day, idx) => (
                    <span key={idx} className="badge bg-dark rounded-pill fs-6">
                      {day}
                    </span>
                    ))
                  ) : (
                    <span className="text-muted fs-5">N/A</span>
                  )}
                  </div>
                </div>
                {/* <div className="mb-3">
                    <div className="d-flex align-items-center gap-2">
                    <h6 className="fs-5 mb-0">Service Hours:</h6>
                    <span className="fs-5">{settlerService?.serviceStartTime} - {settlerService?.serviceEndTime}</span>
                    </div>
                </div> */}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card className="mt-4">
        <Card.Body>
          <h4 className="mb-4">Customer Reviews</h4>
          {reviews && reviews.length > 0 ? (
            <div className="row g-3">
              {reviews.map((review, idx) => (
                <div key={idx} className="col-12">
                  <div className="border rounded p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-1">{review.customer?.firstName} {review.customer?.lastName}</h6>
                        <span className="text-warning">
                          {'★'.repeat(review.customerOverallRating || 0)}
                          {'☆'.repeat(5 - (review.customerOverallRating || 0))}
                        </span>
                        {review.customerReviewImageUrls && review.customerReviewImageUrls.length > 0 && (
                          <div className="d-flex gap-2 mt-2">
                            {review.customerReviewImageUrls.map((imgUrl, imgIdx) => (
                              <img
                                key={imgIdx}
                                src={imgUrl}
                                alt={`Review ${imgIdx + 1}`}
                                className="rounded"
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <small className="text-muted">{new Date(review.customerCreateAt).toLocaleDateString()}</small>
                    </div>
                    <p className="mb-0">{review.customerFeedback}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No reviews yet</p>
          )}
        </Card.Body>
      </Card>
    </>
  )
}

export default SettlerServiceProfile
