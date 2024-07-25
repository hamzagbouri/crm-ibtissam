import React, { useState } from "react";
import { Card, Col, CardBody, Container, Row, CardHeader } from "reactstrap";
import Dropzone from "react-dropzone";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import avatar from "../../assets/images/base/avatar.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import SwiperCore from "swiper";
import { Link } from "react-router-dom";
import {downloadFileRequest, uploadFileRequest} from "../ApiCalls/AssistantAPI";
SwiperCore.use([FreeMode, Navigation, Thumbs]);

export default function Assitant() {
  document.title = "Assistant";

  const [selectedFiles, setselectedFiles] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [uploadedFileId, setUploadedFileId] = useState(null);

  const tileBoxs1 = [
    {
      id: 1,
      bgColor: "bg-secondary",
      label: "Download Intructions File",
      labelClass: "white-50",
      caption: "download instructions",
      captionClass: "text-white-50",
      icon: "ri-file-download-line",
      iconClass: "white",
      opacity: "bg-opacity-25",
    },
    {
      id: 2,
      label: "Download Your Data File",
      labelClass: "white-50",
      caption: "download your data",
      icon: "ri-file-download-line",
      iconClass: "white",
      opacity: "bg-opacity-25",
      bgColor: "bg-info",
      captionClass: "text-white-50",
    },
  ];
///////////////////////////////UPLOADING THE FILE TO DB ///
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', 'FILE_FRONT');
    formData.append('aiId', '56f5407d-d58c-4179-aef3-171527b4489e');

    try {
      const data = await uploadFileRequest(formData);
      setUploadedFileId(data);
      console.log('File uploaded successfully', data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleFileDownload = async (fileId) => {
    try {
      console.log('Downloading file with ID:', fileId);
      const blob = await downloadFileRequest(fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'downloaded-file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };


  ///////////////////////////////////
  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Assistant" pageTitle="CRM" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <h4>Virtual Assistant</h4>
              </CardHeader>
              <CardBody>
                <Row className="gx-lg-5">
                  <Col xl={4} md={8} className="mx-auto">
                    <div className="product-img-slider sticky-side-div">
                      <Swiper
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        className="swiper product-thumbnail-slider p-2 rounded bg-light"
                      >
                        <div className="swiper-wrapper">
                          <SwiperSlide>
                            <img
                              src={avatar}
                              alt=""
                              className="img-fluid d-block"
                            />
                          </SwiperSlide>
                          <SwiperSlide>
                            <img
                              src={avatar}
                              alt=""
                              className="img-fluid d-block"
                            />
                          </SwiperSlide>
                          <SwiperSlide>
                            <img
                              src={avatar}
                              alt=""
                              className="img-fluid d-block"
                            />
                          </SwiperSlide>
                          <SwiperSlide>
                            <img
                              src={avatar}
                              alt=""
                              className="img-fluid d-block"
                            />
                          </SwiperSlide>
                        </div>
                      </Swiper>

                      <div className="product-nav-slider mt-2">
                        <Swiper
                          onSwiper={setThumbsSwiper}
                          slidesPerView={4}
                          freeMode={true}
                          watchSlidesProgress={true}
                          spaceBetween={10}
                          className="swiper product-nav-slider mt-2 overflow-hidden"
                        >
                          <div className="swiper-wrapper">
                            <SwiperSlide className="rounded">
                              <div className="nav-slide-item">
                                <img
                                  src={avatar}
                                  alt=""
                                  className="img-fluid d-block rounded"
                                />
                              </div>
                            </SwiperSlide>
                            <SwiperSlide>
                              <div className="nav-slide-item">
                                <img
                                  src={avatar}
                                  alt=""
                                  className="img-fluid d-block rounded"
                                />
                              </div>
                            </SwiperSlide>
                            <SwiperSlide>
                              <div className="nav-slide-item">
                                <img
                                  src={avatar}
                                  alt=""
                                  className="img-fluid d-block rounded"
                                />
                              </div>
                            </SwiperSlide>
                            <SwiperSlide>
                              <div className="nav-slide-item">
                                <img
                                  src={avatar}
                                  alt=""
                                  className="img-fluid d-block rounded"
                                />
                              </div>
                            </SwiperSlide>
                          </div>
                        </Swiper>
                      </div>
                    </div>
                  </Col>

                  <Col xl={8} md={4}>
                    {/* DOWNLOAD INSTRUCTIONS FILE AND DOWNLOAD DATA FILE IF ALREADY UPLOADED */}
                    <Row>
                      {(tileBoxs1 || []).map((item, key) => (
                        <Col xl={6} md={12} key={key}>
                          <Card className={"card-animate " + item.bgColor}>
                            <CardBody>
                              <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                  <p
                                    className={
                                      "text-uppercase fw-semibold mb-0 text-" +
                                      item.labelClass
                                    }
                                  >
                                    {item.label}
                                  </p>
                                </div>
                              </div>
                              <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                  <Link
                                      to="#"
                                      className={"text-decoration-underline " + item.captionClass}
                                      onClick={() => {
                                        console.log('Download link clicked, uploadedFileId:', uploadedFileId);
                                        if (uploadedFileId) {
                                          handleFileDownload(uploadedFileId);
                                        }
                                      }}
                                  >
                                    {item.caption}
                                  </Link>

                                </div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span
                                    className={
                                      "avatar-title rounded fs-3 bg-" +
                                      item.iconClass +
                                      " " +
                                      item.iconClass +
                                      " " +
                                      item.opacity
                                    }
                                  >
                                    <i
                                      className={
                                        item.icon + " text-" + item.iconClass
                                      }
                                    ></i>
                                  </span>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    {/* UPLOAD */}
                    <div className="mt-xl-0 mt-5">
                      <Row>
                        <Col xl={12} md={12}>
                          <Card className={"card-animate "}>
                            <CardBody>
                              <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                  <p
                                    className={
                                      "text-uppercase fw-semibold mb-0 text-"
                                    }
                                  >
                                    Upload
                                  </p>
                                </div>
                              </div>

                              <p className="text-muted">
                                Drag’n’drop your file
                              </p>
                              <Dropzone
                                  onDrop={(acceptedFiles) => {
                                    handleAcceptedFiles(acceptedFiles);
                                    if (acceptedFiles.length > 0) {
                                      handleFileUpload(acceptedFiles[0]);
                                    }
                                  }}
                              >
                              {({ getRootProps, getInputProps }) => (
                                  <div className="dropzone dz-clickable">
                                    <div
                                      className="dz-message needsclick"
                                      {...getRootProps()}
                                    >
                                      <div className="mb-3">
                                        <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                      </div>
                                      <h4>
                                        Drop files here or click to upload.
                                      </h4>
                                    </div>
                                  </div>
                                )}
                              </Dropzone>
                              <div
                                className="list-unstyled mb-0"
                                id="file-previews"
                              >
                                {selectedFiles.map((f, i) => {
                                  return (
                                    <Card
                                      className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                      key={i + "-file"}
                                    >
                                      <div className="p-2">
                                        <Row className="align-items-center">
                                          <Col className="col-auto">
                                            <img
                                              data-dz-thumbnail=""
                                              height="80"
                                              className="avatar-sm rounded bg-light"
                                              alt={f.name}
                                              src={f.preview}
                                            />
                                          </Col>
                                          <Col>
                                            <Link
                                              to="#"
                                              className="text-muted font-weight-bold"
                                            >
                                              {f.name}
                                            </Link>
                                            <p className="mb-0">
                                              <strong>{f.formattedSize}</strong>
                                            </p>
                                          </Col>
                                        </Row>
                                      </div>
                                    </Card>
                                  );
                                })}
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
