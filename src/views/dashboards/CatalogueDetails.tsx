import TitleHelmet from '@/components/Common/TitleHelmet'
import { Card, Form, Button, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Catalogue, deleteCatalogue, fetchSelectedCatalogue, updateCatalogue } from '@/services/CatalogueServices'
import { SERVICE_CATEGORIES } from '@/constants/ServiceCategory'
import PageBreadcrumbButton from '@/components/Common/PageBreadcrumbButton'

const CatalogueDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [catalogue, setCatalogue] = useState<Catalogue>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const load = async () => {
      if (id && id !== 'new') {
        const data = await fetchSelectedCatalogue(id);
        setCatalogue(data);
      } else {
        // Initialize empty form for creation
        setCatalogue({
          imageUrls: [],
          title: '',
          description: '',
          includedServices: '',
          excludedServices: '',
          category: '',
          basePrice: 0,
          coolDownPeriodHours: 0,
          dynamicOptions: [],
          isActive: true,
          bookingsCount: 0,
          averageRatings: 0,
          createAt: null,
          updateAt: null,
        });
      }
    };
    load();
  }, [id]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setCatalogue(prev => {
      if (!prev) return prev
      return {
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value
      }
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCatalogue(prev => {
        if (!prev) return prev;
        const newImages = [...prev.imageUrls, reader.result as string];
        return { ...prev, imageUrls: newImages };
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    if (!catalogue) return;
    const newImages = catalogue.imageUrls.filter((_, i) => i !== index);
    setCatalogue(prev => prev ? { ...prev, imageUrls: newImages } : prev);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCatalogue(prev => {
      if (!prev) return prev
      return {
        ...prev,
        [e.target.name]: e.target.checked
      }
    })
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!catalogue) return;

    // Validation
    const missingFields: string[] = [];
    if (!catalogue.title) missingFields.push('Title');
    if (catalogue.basePrice == null) missingFields.push('Base Price');
    if (!catalogue.category) missingFields.push('Category');
    if (catalogue.imageUrls.length === 0) missingFields.push('At least one Image');

    if (missingFields.length > 0) {
      setLoading(false);
      alert(`Please fill in all required fields:\n- ${missingFields.join('\n- ')}`);
      return;
    }

    try {
      if (id && id !== 'new') {
        await updateCatalogue(id, catalogue);
        alert('Catalogue updated successfully!');
      } else {
        alert('New service created successfully!');
        window.location.href = '/dashboards/catalogues';
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save catalogue.' + err);
    } finally {
      setLoading(false);
    }
  };


  if (!catalogue) {
    return <div>Loading...</div>
  }

  const renderAddImage = () => (
    <label
      className="border rounded d-flex align-items-center justify-content-center"
      style={{
        width: "120px",
        height: "120px",
        cursor: loading ? "not-allowed" : "pointer",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div className="text-center">
        <i className="bi bi-plus fs-1 text-muted"></i>
        <div className="small text-muted">Add Image</div>
      </div>
      <input
        disabled={loading}
        type="file"
        accept="image/*"
        className="d-none"
        onChange={handleFileChange}
      />
    </label>
  );

  return (
    <>
      <TitleHelmet title={id ? 'Edit Catalogue' : 'Create Catalogue'} />
      <PageBreadcrumbButton title="Catalogue" subName="Dashboard" />
      <Card className="flex-grow-1">
        <Card.Header>
          <Row className="align-items-center">
            <Col md={10}>
              <h4 className="mb-0">{id && id !== 'new' ? `Catalogue ID: ${id}` : 'New Catalogue'}</h4>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-0">
                <div className="d-flex align-items-center gap-2">
                  <Form.Label className="mb-0">Status:</Form.Label>
                  <Form.Check
                    disabled={loading}
                    type="switch"
                    name="isActive"
                    label={catalogue.isActive ? 'Active' : 'Inactive'}
                    checked={catalogue.isActive}
                    onChange={handleCheckboxChange}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <div className="mt-4">
                <h5 className="mb-3">General Information:</h5>
              </div>
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        disabled={loading}
                        type="text"
                        name="title"
                        value={catalogue.title}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        disabled={loading}
                        as="textarea"
                        rows={4}
                        name="description"
                        value={catalogue.description}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Row>
                      <Col md={3}>
                        <Form.Group className="mb-0">
                          <Form.Label className="mb-2">Category</Form.Label>
                          <DropdownButton
                            title={catalogue.category || 'Category'}
                            className="flex-grow-1"
                            disabled={loading}
                          >
                            {SERVICE_CATEGORIES.map((category) => (
                              <Dropdown.Item
                                key={category.value}
                                active={catalogue.category === category.value}
                                onClick={() => setCatalogue(prev => prev ? { ...prev, category: category.value } : prev)}
                              >
                                {category.label}
                              </Dropdown.Item>
                            ))}
                          </DropdownButton>
                        </Form.Group>
                      </Col>
                        <Col md={4}>
                        <Form.Group className="mb-0">
                          <Form.Label>Base Price (RM)</Form.Label>
                          <Form.Control
                          disabled={loading}
                          type="number"
                          name="basePrice"
                          value={catalogue.basePrice}
                          onChange={handleChange}
                          min="0"
                          step="1"
                          required
                          />
                        </Form.Group>
                        </Col>
                        <Col md={5}>
                        <Form.Group className="mb-0">
                          <Form.Label>Warranty Period (Hours)</Form.Label>
                          <Form.Control
                          disabled={loading}
                          type="number"
                          name="coolDownPeriodHours"
                          value={catalogue.coolDownPeriodHours}
                          onChange={(e) => {
                            setCatalogue(prev => {
                            if (!prev) return prev;
                            return {
                              ...prev,
                              coolDownPeriodHours: parseFloat(e.target.value)
                            };
                            });
                          }}
                          min="0"
                          step="1"
                          required
                          />
                        </Form.Group>
                        </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Catalogue Images (Max 5)</Form.Label>
                      <div className="d-flex flex-wrap gap-2">
                        {catalogue.imageUrls.length === 0 ? (
                          <label
                            className="border rounded d-flex align-items-center justify-content-center w-100"
                            style={{
                              height: "250px",
                              cursor: loading ? "not-allowed" : "pointer",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            <div className="text-center">
                              <i className="bi bi-image fs-1 text-muted"></i>
                              <div className="mt-2 text-muted">No images available</div>
                              <div className="small text-muted">Click to add image</div>
                            </div>
                            <input
                              disabled={loading}
                              type="file"
                              accept="image/*"
                              className="d-none"
                              onChange={handleFileChange}
                            />
                          </label>
                        ) : (
                          <>
                            {catalogue.imageUrls.map((img, idx) => (
                              <div
                                key={idx}
                                className="position-relative border rounded"
                                style={{ width: "120px", height: "120px" }}
                              >
                                <img
                                  src={img}
                                  alt={`catalogue-${idx}`}
                                  className="w-100 h-100 rounded"
                                  style={{ objectFit: "cover" }}
                                />
                                <Button
                                  disabled={loading}
                                  variant="danger"
                                  size="sm"
                                  className="position-absolute top-0 end-0 m-1"
                                  style={{ padding: "2px 6px" }}
                                  onClick={() => removeImage(idx)}
                                >
                                  <i className="fi fi-rr-trash "></i>
                                </Button>
                              </div>
                            ))}

                            {catalogue.imageUrls.length < 5 && renderAddImage()}
                          </>
                        )}
                      </div>
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <div className="mt-4">
                <h5 className="mb-3">Service Scope of Work:</h5>
              </div>
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Included Services</Form.Label>
                      <Form.Control
                        disabled={loading}
                        as="textarea"
                        rows={9}
                        name="includedServices"
                        value={catalogue.includedServices}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Excluded Services</Form.Label>
                      <Form.Control
                        disabled={loading}
                        as="textarea"
                        rows={9}
                        name="excludedServices"
                        value={catalogue.excludedServices}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* addons here */}
            <div className="mb-4 mt-4">
              <h5 className="mb-3">Quote Options:</h5>
              {catalogue.dynamicOptions?.map((opt, optIndex) => (
                <Card key={opt.id || optIndex} className="mb-3">
                  <Card.Body>
                    {/* Main Option Name */}
                    <Form.Group className="mb-3">
                      <Form.Control
                        disabled={loading}
                        type="text"
                        value={opt.name}
                        onChange={(e) => {
                          const newOptions = [...(catalogue.dynamicOptions || [])]
                          newOptions[optIndex].name = e.target.value
                          setCatalogue(prev => prev ? { ...prev, dynamicOptions: newOptions } : prev)
                        }}
                        placeholder="Main option (e.g. sqft, extras)"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        disabled={loading}
                        type="checkbox"
                        label="Allow multiple selection"
                        checked={!opt.multipleSelect}
                        onChange={(e) => {
                          const newOptions = [...(catalogue.dynamicOptions || [])]
                          newOptions[optIndex].multipleSelect = !e.target.checked
                          setCatalogue(prev => prev ? { ...prev, dynamicOptions: newOptions } : prev)
                        }}
                      />
                    </Form.Group>

                    {/* Sub Options */}
                    {opt.subOptions?.map((sub, subIndex) => (
                      <Card key={sub.id || subIndex} className="mb-2 border">
                        <Card.Body className="p-2">
                          <Row>
                            <Col md={4}>
                              <Form.Control
                                disabled={loading}
                                type="text"
                                size="sm"
                                value={sub.label}
                                onChange={(e) => {
                                  const newOptions = [...(catalogue.dynamicOptions || [])]
                                  newOptions[optIndex].subOptions[subIndex].label = e.target.value
                                  setCatalogue(prev => prev ? { ...prev, dynamicOptions: newOptions } : prev)
                                }}
                                placeholder="Value (e.g. 10 sqft)"
                                className="mb-2"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Control
                                disabled={loading}
                                type="number"
                                size="sm"
                                value={sub.additionalPrice}
                                onChange={(e) => {
                                  const newOptions = [...(catalogue.dynamicOptions || [])]
                                  newOptions[optIndex].subOptions[subIndex].additionalPrice = parseFloat(e.target.value)
                                  setCatalogue(prev => prev ? { ...prev, dynamicOptions: newOptions } : prev)
                                }}
                                placeholder="Price (e.g. +$15)"
                                className="mb-2"
                              />
                            </Col>
                            <Col md={4}>
                              <Form.Control
                                disabled={loading}
                                type="text"
                                size="sm"
                                value={sub.notes}
                                onChange={(e) => {
                                  const newOptions = [...(catalogue.dynamicOptions || [])]
                                  newOptions[optIndex].subOptions[subIndex].notes = e.target.value
                                  setCatalogue(prev => prev ? { ...prev, dynamicOptions: newOptions } : prev)
                                }}
                                placeholder="Notes"
                                className="mb-2"
                              />
                            </Col>
                            <Col md={1}>
                              <Button
                                disabled={loading}
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  const newOptions = [...(catalogue.dynamicOptions || [])]
                                  newOptions[optIndex].subOptions.splice(subIndex, 1)
                                  setCatalogue(prev => prev ? { ...prev, dynamicOptions: newOptions } : prev)
                                }}
                              >
                                <i className="fi fi-rr-trash fs-5"></i>
                              </Button>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}

                    <Button
                      disabled={loading}
                      variant="secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        const newOptions = [...(catalogue.dynamicOptions || [])]
                        newOptions[optIndex].subOptions = [...(newOptions[optIndex].subOptions || []), { id: Date.now(), label: '', additionalPrice: 0, notes: '' }]
                        setCatalogue(prev => prev ? { ...prev, dynamicOptions: newOptions } : prev)
                      }}
                    >
                      <i className="bi bi-plus me-1"></i> Add Variety
                    </Button>

                    <Button
                      disabled={loading}
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        const newOptions = catalogue.dynamicOptions?.filter((_, i) => i !== optIndex) || []
                        setCatalogue(prev => prev ? { ...prev, dynamicOptions: newOptions } : prev)
                      }}
                    >
                      <i className="bi bi-trash me-1"></i> Remove Option
                    </Button>
                  </Card.Body>
                </Card>
              ))}

              <Button
                disabled={loading}
                variant="primary"
                onClick={() => {
                  const newOptions = [...(catalogue.dynamicOptions || []), { id: Date.now(), name: '', multipleSelect: false, subOptions: [] }]
                  setCatalogue(prev => prev ? { ...prev, dynamicOptions: newOptions } : prev)
                }}
              >
                <i className="bi bi-plus me-1"></i> Add Option
              </Button>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <Button disabled={loading} variant="primary" type="submit" onClick={handleSubmit} >
                {loading ? (id && id !== 'new' ? 'Updating...' : 'Submiting...') : id && id !== 'new' ? 'Update Catalogue' : 'Create Catalogue'}
              </Button>
              { id && id !== 'new' && (
                <Button
                  disabled={loading}
                  variant={catalogue.isActive ? 'danger' : 'success'}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await deleteCatalogue(id);
                      alert(`Catalogue deleted successfully!`);
                      window.location.href = '/dashboards/catalogues';
                    } catch (err) {
                      console.error(err);
                      alert('Failed to update status.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {loading ? 'Deleting...' : 'Delete Catalogue'}
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}

export default CatalogueDetails