import React, { useEffect, useState, useCallback } from "react";
import * as moment from "moment";
import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  ModalFooter,
  Table,
  FormFeedback,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
import TableContainer from "../../Components/Common/TableContainer";
import Loader from "../../Components/Common/Loader";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import * as Yup from "yup";
import { useFormik } from "formik";
import axiosWithToken from "../ApiCalls/axiosWithToken";
import * as ReportsAPI from "../ApiCalls/ReportsAPI";
import * as LeadApi from "../ApiCalls/LeadsAPI";


export default function Reports() {
  document.title = "Reports";



  // State management
  const [isEdit, setIsEdit] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState([]);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [reportDeleted, setReportDeleted] = useState(false);
  const [reportAdded, setReportAdded] = useState(false);
  const [modal, setModal] = useState(false);
  const [info, setInfo] = useState([]);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const[isLoiding  , setLoiding ] = useState(true);

  /* useEffect(() => {
     setReports(mockReports);
     if (!info.id && reports.length > 0) {
       setIsEdit(false);
       setInfo(reports[0]);
     }
   }, []);*/



  const getAllReports = async () => {
    try {
      const response = await axiosWithToken.get('/report/get-reports-by-client');
      if (response.data != null ) {
        const reports = response.data.map(report => ({
          ...report,
          _id: report.reportId,
        }));
        console.log('Response of getting all report of this client:', reports);
        return reports;
      }else {
        console.log('No reports found');
        return [];
      }

    } catch (error) {
      console.error('Error getting reports:', error);
      throw error;
    }
  } ;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const RepostsData = await  getAllReports();
        setReports(RepostsData);

        if (!info.id && RepostsData.length > 0) {
          setIsEdit(false);
          setInfo(RepostsData[0]);
        }
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      }finally {
        setLoiding(false);
      }
    };      fetchData();
  }, []);



  ////////////////////////////////////// HANDLERS ////////////////////////////////////

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setIsEdit(false);
      setSelectedReport(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  const toggleViewModal = useCallback(() => {
    setViewModal(!viewModal);
  }, [viewModal]);

  const handleReportClicks = () => {
    setSelectedReport("");
    setIsEdit(false);
    toggle();
  };

  const handleValidDate = (date) => {
    if (!date) return "Invalid date";
    const date1 = moment(new Date(date)).format("DD MMM YYYY");
    return date1;
  };

  ////////////////////////////////////// CREATE ////////////////////////////////////
  /*
    const updatesReport = (newReport) => {
      const existingReportIndex = reports.findIndex(
        (c) => c._id === newReport._id
      );
      let updatedReports;
      if (existingReportIndex !== -1) {
        updatedReports = reports.map((c, index) =>
          index === existingReportIndex
            ? {
                ...c,
                ...newReport,
              }
            : c
        );
      }
      setReports(updatedReports);
      setReportAdded(true);
      setIsEdit(false);
      setModal(false);
    };

    useEffect(() => {
      if (reportAdded) {
        setReportAdded(false);
      }
    }, [reportAdded]);*/


  const addReport = async(reportData) => {
    console.log("NEW REPORT " , reportData) ;
    try {
      console.log("BEFORE CALLING THE API") ;
      const response = await ReportsAPI.generateClientReport(reportData).catch(error => {
        console.error("Error caught in generateClientReport:", error);
        throw error;
      });
      console.log("AFTER CALLING THE API")
      toast.success('Report added successfully.');

      const newR = {
        ...response,
        _id:  response.reportId,
      };
      setReports(prevReports => [...prevReports, newR]);
      setReportAdded(true);
      setIsEdit(false);
      setModal(false);
    }
    catch (error) {
      toast.error(' Failed to add Report ') ;
    }
  };


  useEffect(() => {
    if (reportAdded) {
      setReportAdded(false);
    }
  }, [reportAdded]);

  ////////////////////////////////////// UPDATE ////////////////////////////////////

  const handleReportClick = useCallback(
      (arg) => {
        const selectedReport = arg;

        setSelectedReport({
          _id: selectedReport._id,
          title: selectedReport.title,
          generated_by: selectedReport.generated_by,
          generated_for: selectedReport.generated_for,
          generation_date: selectedReport.generation_date,
          report_content: selectedReport.reportContent,
          path:selectedReport.path,
          download_url: selectedReport.download_url,
        });

        setIsEdit(true);
        toggle();
      },
      [toggle]
  );

  const HandleupdateReport = async (id, updateReport) => {
    console.log('New report body ID ', id);

    try {
      console.log("BR API  CALL ") ;
      console.log('New report body Form ', updateReport);
      const response = await ReportsAPI.updateReportRequest(id, updateReport);
      const updatedR = {
        ...response,
        _id: id,
      };
      setReports(reports.map(report =>
          report._id === id ? updatedR : report
      ));
      toast.success('Report updated successfully.');
     setReportAdded(true);
      setIsEdit(false);
      setModal(false);
    } catch (error) {
      toast.error('Failed to Report collaborator.');
    }
  };


  ////////////////////////////////////// DELETE ////////////////////////////////////

  /*  const deleteReport = useCallback((reportToDelete) => {
      setReports((prevReports) =>
        prevReports.filter((c) => c.id !== reportToDelete.id)
      );
      setReportDeleted(true);
    }, [])*/;

  const deleteReport = useCallback(async (reportToDelete) => {
    try {
      const response = await ReportsAPI.deleteReportRequest(reportToDelete._id);
      if (response) {
        setReports((prevReports) =>
            prevReports.filter((c) => c._id !== reportToDelete._id)
        );
        setReportDeleted(true);
        toast.success('Report deleted successfully.');
      } else {
        toast.error('Failed to delete Report.');
      }
    } catch (error) {
      toast.error('Failed to delete Report.');
    }
  }, []);

  const handleDeleteReport = useCallback(() => {
    if (reportToDelete) {
      deleteReport(reportToDelete);
      setDeleteModal(false);
    }
  }, [reportToDelete, deleteReport]);

  const onClickDelete = (reports) => {
    setReportToDelete(reports);
    setDeleteModal(true);
  };

  useEffect(() => {
    if (reportToDelete) {
      deleteReport(reportToDelete);
      setReportToDelete(null);
    }
  }, [reportDeleted]);

  //////////////////////////////////////   EXPORT  ////////////////////////////////////

  const headers = [
    { id: "reportId", displayName: "Report ID" },
    { id: "title", displayName: "Title" },
    { id: "generated_for", displayName: "Generated For" },
    { id: "generated_by", displayName: "Generated By" },
    { id: "generation_date", displayName: "Generation Date" },
    {id : "report_content" , displayName: "Report Content" },
  ];

  /////////////////////////////////////////////////////////////////////////////////////
  /*
    const downdloadReport = (url) => {
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  */
  const downdloadReport = async (id) => {
    try {
      const response = await ReportsAPI.downloadReportPDFRequest(id);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to fetch report download URL:', error);
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////
  // validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      _id: selectedReport ? selectedReport._id : "0",
      title: (selectedReport && selectedReport.title) || "",
      report_content: (selectedReport && selectedReport.report_content) || "",
      path: (selectedReport && selectedReport.path) || "",
      /*generated_for: (selectedReport && selectedReport.generated_for) || "",
      generated_by: (selectedReport && selectedReport.generated_by) || "",*/
    },

    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Title"),
      report_content: Yup.string().required("Please Enter Report Content"),
      path: Yup.string().required("Please Enter Path"),
      /* generated_for: Yup.string().required("Please Enter Generated For"),
       generated_by: Yup.string().required("Please Enter Email"),*/
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateReport = {
          _id: selectedReport ? selectedReport._id : 0,
          title: values.title,
          reportContent : values.report_content ,
          path: values.path ,
          /* generated_for: values.generated_for,
           generated_by: values.generated_by,
           generation_date: moment().format("DD MMM YYYY"),
           download_url: values["download_url"],*/
        };
        console.log("id", selectedReport._id);
        HandleupdateReport(selectedReport._id, updateReport);
        validation.resetForm();
        toggle() ;
      }
      else {
        const newReport = {
          title: values["title"],
          reportContent: values["report_content"],
          path: values["path"],
        };
        console.log('New report body in sumbit ' , newReport) ;
        addReport(newReport);
        validation.resetForm();
      }


    },
  });

  const columns = [
    {
      header: (
          <input
              type="checkbox"
              className="form-check-input"
              id="checkBoxAll"
              onClick={() => checkedAll()}
          />
      ),
      cell: (cell) => (
          <input
              type="checkbox"
              className="contactCheckBox form-check-input"
              value={cell.row.original.id}
              checked={selectedCheckBoxDelete.includes(cell.row.original.id)}
              onChange={() => handleCheckboxChange(cell.row.original.id)}
          />
      ),
      id: "#",
      accessorKey: "id",
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      header: "Title",
      accessorKey: "title",
      enableColumnFilter: false,
      cell: (cell) => (
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 ms-2 title">{cell.getValue()}</div>
          </div>
      ),
    },
/*    {
      header: "Generated For",
      //accessorKey: "generated_for",
      accessorKey: "genratedFor",
      enableColumnFilter: false,
    },*/
    {
      header: "Generated By",
      //accessorKey: "generated_by",
      accessorKey: "generatedBy",
      enableColumnFilter: false,
    },
    {
      header: "Generation Date",
      // accessorKey: "generation_date",
      accessorKey: "generatedDate",
      enableColumnFilter: false,
      cell: (cell) => <>{handleValidDate(cell.getValue())}</>,
    },
    {
      header: "Action",
      cell: (cellProps) => (
          <ul className="list-inline hstack gap-2 mb-0">
            {/* VIEW */}
            <li className="list-inline-item edit" title="Call">
              <div
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    const reportData = cellProps.row.original;
                    setInfo(reportData);
                    toggleViewModal();
                  }}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
              >
                <i className="ri-eye-fill align-bottom me-2 text-muted"></i>
              </div>
            </li>

            {/* UPDATE  */}
            <li className="list-inline-item edit" title="Message">
              <div
                  className="dropdown-item edit-item-btn"
                  href="#"
                  onClick={() => handleReportClick(cellProps.row.original)}
              >
                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
              </div>
            </li>

            {/* DELETE */}
            <li className="list-inline-item edit" title="Message">
              <div
                  className="dropdown-item remove-item-btn"
                  href="#"
                  onClick={() => {
                    const reportData = cellProps.row.original;
                    onClickDelete(reportData);
                  }}
              >
                <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
              </div>
            </li>
            <li className="list-inline-item"></li>
          </ul>
      ),
    },
  ];

  // checks
  const handleCheckboxChange = useCallback((id) => {
    setSelectedCheckBoxDelete((prevSelected) => {
      const newSelected = prevSelected.includes(id)
          ? prevSelected.filter((item) => item !== id)
          : [...prevSelected, id];
      console.log(newSelected);
      setIsMultiDeleteButton(newSelected.length > 0);
      return newSelected;
    });
  }, []);

  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    if (checkall.checked) {
      const allIds = reports.map((item) => item.id);
      setSelectedCheckBoxDelete(allIds);
      setIsMultiDeleteButton(true);
      console.log(allIds);
    } else {
      setSelectedCheckBoxDelete([]);
      setIsMultiDeleteButton(false);
    }
  }, [reports]);

  const deleteMultiple = useCallback(() => {
    setReports((prevReports) => {
      const updatedReports = prevReports.filter(
          (c) => !selectedCheckBoxDelete.includes(c.id)
      );
      return updatedReports;
    });
    setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete([]);
    document.getElementById("checkBoxAll").checked = false;
    setDeleteModalMulti(false);
  }, [selectedCheckBoxDelete]);

  useEffect(() => {
    if (reportDeleted) {
      setReportToDelete(null);
      setReportDeleted(false);
    }
  }, [reportDeleted]);

  return (
      <React.Fragment>
        <div className="page-content">
          <ExportCSVModal
              show={isExportCSV}
              onCloseClick={() => setIsExportCSV(false)}
              data={reports.map((report) => ({
                reportId: String(report.reportId),
                title: String(report.title),
                generated_for: String(report.genratedFor),
                generated_by: String(report.generatedBy),
                generation_date: String(report.generatedDate),
              }))}
              headers={headers}
              filename={"Reports"}
          />

          <DeleteModal
              show={deleteModal}
              onDeleteClick={handleDeleteReport}
              onCloseClick={() => setDeleteModal(false)}
          />
          <DeleteModal
              show={deleteModalMulti}
              onDeleteClick={() => {
                deleteMultiple();
                setDeleteModalMulti(false);
              }}
              onCloseClick={() => setDeleteModalMulti(false)}
          />
          <Container fluid>
            <BreadCrumb title="Reports" pageTitle="CRM" />
            <Row>
              <Col lg={12}>
                <Card>
                  <CardHeader>
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      {/* :::::::::::::::::::::::::: DELETE MULTIPLE Reports ::::::::::::::::::: */}
                      <div className="flex-shrink-0">
                        <div className="hstack text-nowrap gap-2">
                          {isMultiDeleteButton && (
                              <button
                                  className="btn btn-secondary"
                                  onClick={() => setDeleteModalMulti(true)}
                              >
                                <i className="ri-delete-bin-2-line"></i>
                              </button>
                          )}
                          <button className="btn btn-danger">
                            <i className="ri-filter-2-line me-1 align-bottom"></i>{" "}
                            Filters
                          </button>
                          <button
                              className="btn btn-soft-success"
                              onClick={() => setIsExportCSV(true)}
                          >
                            Export
                          </button>
                          <button
                              className="btn btn-soft-success"
                              onClick={() => setModal(true)}
                          >
                            Create Report
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Col>
              <Col xxl={9}>
                <Card id="contactList">
                  <CardBody className="pt-0">
                    {/* :::::::::::::::::::::: LIST Reports :::::::::::::::::::::::::: */}
                    {/*{reports && reports.length ? (*/}
                    {isLoiding  ? ( <Loader/> ) : (

                        <TableContainer
                            columns={columns}
                            data={reports || []}
                            isGlobalFilter={true}
                            isAddUserList={false}
                            customPageSize={8}
                            className="custom-header-css"
                            divClass="table-responsive table-card mb-3"
                            tableClass="align-middle table-nowrap"
                            theadClass="table-light"
                            handleReportClick={handleReportClicks}
                            SearchPlaceholder="Search for reports..."
                        /> )}
                    {/*) : (*/}
                    {/*  <Loader />*/}
                    {/*)}*/}

                    {/* :::::::::::::::::::::: UPDATE MODAL :::::::::::::::::::::::::: */}
                    <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                      <ModalHeader className="bg-info-subtle p-3" toggle={toggle}>
                        {!!isEdit ? "Edit Report" : "Add Report"}
                      </ModalHeader>
                      <Form
                          className="tablelist-form"
                          onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                          }}
                      >
                        <ModalBody>
                          <Input type="hidden" id="id-field" />
                          <Row className="g-3">
                            <Col lg={12}>
                              <div>
                                <Label
                                    htmlFor="title-field"
                                    className="form-label"
                                >
                                  Title
                                </Label>
                                <Input
                                    name="title"
                                    id="customername-field"
                                    className="form-control"
                                    placeholder="Enter Title"
                                    type="text"
                                    validate={{
                                      required: { value: true },
                                    }}
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.title || ""}
                                    invalid={
                                      validation.touched.title &&
                                      validation.errors.title
                                          ? true
                                          : false
                                    }
                                />
                                {validation.touched.title &&
                                validation.errors.title ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.title}
                                    </FormFeedback>
                                ) : null}
                              </div>
                            </Col>



                            <Col lg={12}>
                              <div>
                                <Label
                                    htmlFor="reportContent-field"
                                    className="form-label"
                                >
                                  Report Content
                                </Label>
                                <Input
                                    name="report_content"
                                    id="customername-field"
                                    className="form-control"
                                    placeholder="Enter your report content"
                                    type="text"
                                    validate={{
                                      required: { value: true },
                                    }}
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.report_content  || ""}
                                    invalid={
                                      validation.touched.report_content  &&
                                      validation.errors.report_content
                                          ? true
                                          : false
                                    }
                                />
                                {validation.touched.report_content  &&
                                validation.errors.report_content  ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.report_content }
                                    </FormFeedback>
                                ) : null}
                              </div>
                            </Col>



                            <Col lg={12}>
                              <div>
                                <Label
                                    htmlFor="path-field"
                                    className="form-label"
                                >
                            Path
                                </Label>
                                <Input
                                    name="path"
                                    id="customername-field"
                                    className="form-control"
                                    placeholder="Enter the path"
                                    type="text"
                                    validate={{
                                      required: { value: true },
                                    }}
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.path || ""}
                                    invalid={
                                      validation.touched.path &&
                                      validation.errors.path
                                          ? true
                                          : false
                                    }
                                />
                                {validation.touched.path &&
                                validation.errors.path ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.path}
                                    </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          </Row>
                        </ModalBody>
                        <ModalFooter>
                          <div className="hstack gap-2 justify-content-end">
                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={() => {
                                  setModal(false);
                                }}
                            >
                              Close
                            </button>
                            <button
                                type="submit"
                                className="btn btn-success"
                                id="add-btn"
                            >
                              {!!isEdit ? "Update" : "Add Report"}
                            </button>
                          </div>
                        </ModalFooter>
                      </Form>
                    </Modal>
                    <ToastContainer closeButton={false} limit={1} />
                  </CardBody>
                </Card>
              </Col>

              {/* :::::::::::::::::::::: VIEW Report :::::::::::::::::::::::::: */}
              <Modal
                  id="viewModal"
                  isOpen={viewModal}
                  toggle={toggleViewModal}
                  centered
              >
                <ModalHeader toggle={toggleViewModal}>View Report</ModalHeader>
                <ModalBody>
                  <div id="contact-view-detail">
                    <div className="text-center mb-3">
                      <h5 className="mt-4 mb-1">{info.title}</h5>
                     </div>
                    <div>
                      <div className="table-responsive table-card">
                        <Table className="table table-borderless mb-0">
                          <tbody>
                          <tr>
                            <td className="fw-medium">Report Content</td>
                            <td>{info.reportContent}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Generated By</td>
                            <td>
                              {info.generatedBy || "tonyanoble@velzon.com"}
                            </td>
                          </tr>

                          <tr>
                            <td className="fw-medium">Generation Date</td>
                            <td>{info.generatedDate}</td>
                          </tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <button
                      type="button"
                      className="btn btn-success"
                      // PREV                   onClick={() => downdloadReport(info.download_url)}
                      onClick={() => downdloadReport(info._id)}
                  >
                    <i className="ri-file-download-line align-bottom me-1"></i>
                    Download
                  </button>
                  <button
                      type="button"
                      className="btn btn-light"
                      onClick={toggleViewModal}
                  >
                    Close
                  </button>
                </ModalFooter>
              </Modal>
            </Row>
          </Container>
        </div>
      </React.Fragment>
  );
}