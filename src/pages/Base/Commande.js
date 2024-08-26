import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
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
import Select from "react-select";
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
import * as CommandeAPI from "../ApiCalls/CommandeAPI";
import * as CollaboratorsAPI from "../ApiCalls/CollaboratorsAPI";
import {updateCommandeRequest} from "../ApiCalls/CommandeAPI";
export default function Commandes() {
  document.title = "Commandes";

/*  // DATA
  const mockCommandes = [
    {
      id: 1,
      commandeId: "#VZ001",
      username: "hajar_ammari",
      name: "Hajar AMMARI",
      quantity: "hajar.ammari@gmail.com",
      unit: "+212 660 51 58 30",
      creation_date: "09 Jul, 2024",
      last_activity: ["11 Jul, 2024", "08:58AM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 2,
      CommandeId: "#VZ002",
      username: "john_doe",
      name: "John DOE",
      quantity: "john.doe@example.com",
      unit: "+1 123 456 7890",
      creation_date: "10 Jul, 2024",
      last_activity: ["12 Jul, 2024", "10:30AM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 3,
      CommandeId: "#VZ003",
      username: "alice_wonderland",
      name: "Alice WONDERLAND",
      quantity: "alice.wonderland@example.com",
      unit: "+44 20 1234 5678",
      creation_date: "11 Jul, 2024",
      last_activity: ["13 Jul, 2024", "11:45AM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 4,
      CommandeId: "#VZ004",
      username: "michael_jones",
      name: "Michael JONES",
      quantity: "michael.jones@example.com",
      unit: "+1 987 654 3210",
      creation_date: "12 Jul, 2024",
      last_activity: ["14 Jul, 2024", "01:20PM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 5,
      CommandeId: "#VZ005",
      username: "sara_smith",
      name: "Sara SMITH",
      quantity: "sara.smith@example.com",
      unit: "+61 2 1234 5678",
      creation_date: "13 Jul, 2024",
      last_activity: ["15 Jul, 2024", "03:10PM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 6,
      CommandeId: "#VZ006",
      username: "adam_brown",
      name: "Adam BROWN",
      quantity: "adam.brown@example.com",
      unit: "+44 20 9876 5432",
      creation_date: "14 Jul, 2024",
      last_activity: ["16 Jul, 2024", "04:55PM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 7,
      CommandeId: "#VZ007",
      username: "emma_davis",
      name: "Emma DAVIS",
      quantity: "emma.davis@example.com",
      unit: "+1 234 567 8901",
      creation_date: "15 Jul, 2024",
      last_activity: ["17 Jul, 2024", "09:20AM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 8,
      CommandeId: "#VZ008",
      username: "peter_smith",
      name: "Peter SMITH",
      quantity: "peter.smith@example.com",
      unit: "+61 2 9876 5432",
      creation_date: "16 Jul, 2024",
      last_activity: ["18 Jul, 2024", "12:40PM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 9,
      CommandeId: "#VZ009",
      username: "lisa_jones",
      name: "Lisa JONES",
      quantity: "lisa.jones@example.com",
      unit: "+1 345 678 9012",
      creation_date: "17 Jul, 2024",
      last_activity: ["19 Jul, 2024", "02:15PM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
    {
      id: 10,
      CommandeId: "#VZ010",
      username: "alex_anderson",
      name: "Alex ANDERSON",
      quantity: "alex.anderson@example.com",
      unit: "+44 20 3456 7890",
      creation_date: "18 Jul, 2024",
      last_activity: ["20 Jul, 2024", "03:50PM"],
      statuses: [{ label: "ACTIVE", value: "ACTIVE" }],
    },
  ]*/;

  const statuses = [
    { label: "Pending", value: "Pending" },
    { label: "Done", value: "Done" },
  ];

  //Status TRONSFORMATION BETWEEN BACK & FRON

  const transformStatus = (status) => {
    return { label: status, value: status };
  };

  const transformStatuses = (statuses) => {
    if (!statuses) return [];
    return statuses.map(status => transformStatus(status));
  };

  // State management
  const [isEdit, setIsEdit] = useState(false);
  const [Commandes, setCommande] = useState([]);
  const [selectedCommande, setSelectedCommande] = useState([]);
  const [CommandeToDelete, setCommandeToDelete] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [CommandeDeleted, setCommandeDeleted] = useState(false);
  const [CommandeAdded, setCommandeAdded] = useState(false);
  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState([]);
  const [assignStatus, setAssignStatus] = useState([]);
  const [info, setInfo] = useState([]);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedProduitFinis, setSelectedProduitFinis] = useState([]);
  const [produitFiniQuantities, setProduitFiniQuantities] = useState({})
  const [produitFinis, setProduitFinis] = useState([]);
  const [permis, setPermis] = useState([]);
  const [produitFiniDetails, setProduitFiniDetails] = useState([]);
  const [clients, setClients] = useState([]);
  const [cliyon, setCliyon] = useState([]);

  const [selectedClient, setSelectedClient] = useState(null);

  const [isLoiding, setLoiding] = useState(true);
///////////////////////////////////////////////////////////////////////////GET ALL CLIENTS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*  useEffect(() => {
    setCommande(mockCommandes);
    if (!info.id && Commandes.length > 0) {
      setIsEdit(false);
      setInfo(Commandes[0]);
    }
  }, []);*/
  

  const getAllClients = async () => {
    try {
      const response = await axiosWithToken.get("/client");
      const datecliant = response.data.map(client => ({ label: client.name, value: client.id }));
      console.log("aq",datecliant)
      setCliyon(datecliant);
      console.log(cliyon)
    } catch (error) {
      console.error("Error getting clients:", error);
      throw error;
    }
  };
  const getAllCommandes = async () => {
    try {
      const response = await axiosWithToken.get('/commande');
      console.log(response)
      if (response.data != null ) {
      const Commandes = response.data.map(Commande => ({
        ...Commande,
        id: Commande.id,
      }));
        console.log('Response of getting all Commandes:', Commandes);
        return Commandes;
      }else {
        console.log('No Commandes found');
        return [];
      }

    } catch (error) {
      console.error('Error getting Commandes:', error);
      throw error;
    }
  } ;

  const getAllProduitFinis = async () => {
    try {
      const response = await axiosWithToken.get("/produit");
      const mappedData = response.data.map(mp => ({ label: mp.name, value: mp.id }));
      console.log("aa",mappedData);
      setPermis(mappedData);
console.log("permis",permis);
    } catch (error) {
      console.error("Error getting matiere premieres:", error);
      throw error;
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const CommandesData = await  getAllCommandes();
        const produitFinisData = await getAllProduitFinis();
        const clientsData = await getAllClients();

        
        setCommande(CommandesData);
        setProduitFinis(produitFinisData);
        setClients(clientsData);


        if (!info.id && CommandesData.length > 0) {
          setIsEdit(false);
          setInfo(CommandesData[0]);
        }
      } catch (error) {
        console.error('Failed to fetch Commandes:', error);
      }finally {
        setLoiding(false);
      }
    };      fetchData();
  }, []);
  const fetchProduitFiniDetails = async (id) => {
    try {
      const response = await axiosWithToken.get(`/produit/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching matiere premiere details:", error);
      return null;
    }
  };
  useEffect(() => {
    const fetchDetails = async () => {
      if (info.produits && typeof info.produits === 'object') {
        const detailsPromises = Object.entries(info.produits).map(async ([id, quantity]) => {
          const details = await fetchProduitFiniDetails(id);
          return { ...details, quantity };
        });

        const details = await Promise.all(detailsPromises);
        
        setProduitFiniDetails(details);
        console.log("d",produitFiniDetails)
      }
    };

    fetchDetails();
  }, [info]);

  ////////////////////////////////////// HANDLERS ////////////////////////////////////

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setIsEdit(false);
      setSelectedCommande(null);
    } else {
      setModal(true);
      setSelectedProduitFinis([]);
      setProduitFiniQuantities({});
      setStatus([]);
      setAssignStatus([]);
    }
  }, [modal]);
  
  function handlesStatus(statuses) {
    setStatus(statuses);
    const assigned = statuses.map(({ label, value }) => ({ label, value }));
    setAssignStatus(assigned);
  }

  const toggleViewModal = useCallback(() => {
    setViewModal(!viewModal);
  }, [viewModal]);

  const handleCommandeClicks = () => {
    setSelectedCommande("");
    setIsEdit(false);
    toggle();
  };

  // Function to format the date
  const handleValidDate = (date) => {
    if (!date) return "Invalid date";
    const date1 = moment(new Date(date)).format("DD MMM YYYY");
    return date1;
  };

  // Function to format the time
  const handleValidTime = (time) => {
    if (!time) return "Invalid time";
    const time1 = moment(time, "hh:mmA");
    if (!time1.isValid()) {
      return "Invalid time";
    }
    return time1.format("hh:mm A");
  };

  ////////////////////////////////////// CREATE ////////////////////////////////////

  const generateNewId = () => {
    return Commandes.length > 0 ? Math.max(Commandes.map((Commande) => Commande.id)) + 1 : 1;
  };

  const generateNewCommandeId = () => {
    return `#VZ${String(generateNewId()).padStart(3, "0")}`;
  };
  function handlesStatus(statuses) {
    setStatus(statuses);
    const assigned = statuses.map(({ label, value }) => ({ label, value }));
    setAssignStatus(assigned);
  }
 
  const addCommande = async(newCommande) => {
    console.log("addCommande called with:", newCommande);

    try {
      const response = await CommandeAPI.addCommandeRequest(newCommande);
   /*   const parts =response.split('CLIENT') ;
      const loginId = parts[0] ;
      const CommandeId = parts[1].trim(" ") ;
      console.log("LOGIN ID of adding Commande:", loginId);
      console.log("CommandeID of adding Commande:", CommandeId);*/
      console.log("CLIENT PASSWORD IS : " ,  response.password)  ;
      const  newL = {
        ...response,
        id : response.CommandeId,
        username : response.username,
      statuses  : newCommande.status ? [transformStatus(newCommande.status)] : [],
      }
     

      console.log('New Commande added:', response) ;
      setCommande(Commandes);
      setCommandeAdded(true);
      setIsEdit(false);
      setModal(false);
      toast.success("Commande addedd!") 
    } catch (error) {
      toast.error('Failed to add Commande.');
      console.error('Error adding Commande:', error);
    }
  }

/*
  const addCommande = (newCommande) => {
    console.log("New Commande:", newCommande);

    // Check if the id exists in the Commandes array
    const existingCommandeIndex = Commandes.findIndex((c) => c.id === newCommande.id);

    let updatedCommandes;
    if (existingCommandeIndex !== -1) {
      // Update existing Commande
      updatedCommandes = Commandes.map((c, index) =>
        index === existingCommandeIndex
          ? {
              ...c, // Preserve other fields from the existing Commande
              ...newCommande, // Update fields with new values
              last_activity: [
                moment().format("DD MMM, YYYY"),
                moment().format("hh:mmA"),
              ],
            }
          : c
      );
    } else {
      // Add new Commande
      const newCommandeWithId = {
        ...newCommande,
        id: generateNewId(), // Generate a new unique id
        CommandeId: generateNewCommandeId(),
        creation_date: moment().format("DD MMM, YYYY"),
        last_activity: [
          moment().format("DD MMM, YYYY"),
          moment().format("hh:mmA"),
        ],
      };
      updatedCommandes = [newCommandeWithId, ...Commandes];
    }

    setCommande(updatedCommandes);
    setCommandeAdded(true);
    setIsEdit(false);
    setModal(false);
  };
*/

  useEffect(() => {
    if (CommandeAdded) {
      setCommandeAdded(false);
    }
  }, [CommandeAdded]);

  ////////////////////////////////////// UPDATE ////////////////////////////////////

  const handleCommandeClick = useCallback(
    (arg) => {
      const selectedCommande = arg;
console.log("sele",selectedCommande)
      setSelectedCommande({
        id: selectedCommande.id,
        dateCommande: selectedCommande.dateCommande,
        dateLivraison: selectedCommande.dateLivraison,
        status: selectedCommande.status,
        
       

      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  const HandleupdateCommande = async (id, updateCommande) => {
    console.log('New collab body Form ', updateCommande);
    console.log('New collab body ID ', id);

    try {
      const response = await CommandeAPI.updateCommandeRequest(id, updateCommande);
      console.log("resp",response)
      const updatedL = {
        ...response,
        id: id,
        statuses: response.status ? [transformStatus(response.status)] : [],
      };
      setCommande(Commandes.map(Commande =>
          Commande.id === id ? updatedL : Commande
      ));
      setCommandeAdded(true);
      setIsEdit(false);
      setModal(false);
      toast.success('Commande updated successfully.');
    } catch (error) {
      toast.error('Failed to update collaborator.');
    }
  };

  ////////////////////////////////////// DELETE ////////////////////////////////////

/*  const deleteCommande = useCallback((CommandeToDelete) => {
    setCommande((prevCommandes) => prevCommandes.filter((c) => c.id !== CommandeToDelete.id));
    setCommandeDeleted(true);
  }, []);*/


  const deleteCommande = useCallback(async (CommandeToDelete) => {
    try {
      const response = await CommandeAPI.deleteCommandeRequest(CommandeToDelete.id);
    

     
        setCommande((prevCommandes) =>
            prevCommandes.filter((c) => c.id !== CommandeToDelete.id)
        );
        setCommandeDeleted(true);

    } catch (error) {
      toast.error('Failed to delete Commande.');
    }
  }, []);


  const handleDeleteCommande = useCallback(() => {
    if (CommandeToDelete) {
      console.log("Commande to deleteeeee",CommandeToDelete)
      deleteCommande(CommandeToDelete);
      setDeleteModal(false);
    }
  }, [CommandeToDelete, deleteCommande]);

  const onClickDelete = (Commandes) => {
    setCommandeToDelete(Commandes);
    setDeleteModal(true);
  };

  useEffect(() => {
    if (produitFiniQuantities) {
      const initialSelected = permis.filter(mp =>
        Object.keys(produitFiniQuantities).includes(mp.value.toString())
      );
      setSelectedProduitFinis(initialSelected);
      setProduitFiniQuantities(produitFiniQuantities);
    }
  }, [produitFiniQuantities, permis]);

  const handleProduitFiniChange = (selectedOptions) => {
    setSelectedProduitFinis(selectedOptions || []);
  };

  const handleProduitFiniQuantityChange = (id, quantity) => {
    setProduitFiniQuantities(prevQuantities => ({
      ...prevQuantities,
      [id]: quantity
    }));
  };

  useEffect(() => {
    if (CommandeToDelete) {
      //deleteCommande(CommandeToDelete); Cz I think is running the deletion twice
      setCommandeToDelete(null);
    }
  }, [CommandeDeleted]);

  //////////////////////////////////////   EXPORT  ////////////////////////////////////

  const headers = [
    { id: "CommandeId", displayName: "Commande ID" },
    { id: "dateLivraison", displayName: "Date Livraison" },
    { id: "dateCommande", displayName: "Date Commande" },
    { id: "status", displayName: "Status" },
    { id: "produits", displayName: "Produits" },

  ];

  //////////////////////////////////////   STATUSES  ////////////////////////////////////

  // const StatusBadge = ({ status }) => {
  //   switch (status) {
  //     case "ACTIVE":
  //       return (
  //         <span className="badge bg-success text-uppercase me-1">{status}</span>
  //       );
  //     case "INACTIVE":
  //       return (
  //         <span className="badge bg-danger text-uppercase me-1">{status}</span>
  //       );

  //     default:
  //       return (
  //         <span className="badge bg-secondary text-uppercase me-1">
  //           {status}
  //         </span>
  //       );
  //   }
  // };

  /////////////////////////////////////////////////////////////////////////////////////
  // validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      id: selectedCommande ? selectedCommande.id : "0",
      client_id: (selectedCommande && selectedCommande.client_id) || "",
      dateCommande: (selectedCommande && selectedCommande.dateCommande) || "",
      dateLivraison: (selectedCommande && selectedCommande.dateLivraison) || "",
      status: (selectedCommande && selectedCommande.status) || "",
    },

    validationSchema: Yup.object({
      dateCommande: Yup.string().required("Please Enter Name"),
      dateLivraison: Yup.string().required("Please Enter Quantity"),
      status: Yup.string().required("Please Enter status"),

    }),
    onSubmit: async (values) => {
        console.log("values",values)
        const produitFiniData = selectedProduitFinis.map(mp => ({
          id: mp.value,
          quantity: produitFiniQuantities[mp.value] || 0
        }));
        const newCommande = {
          ...values,
          produits: produitFiniData
        };
        console.log("npf",newCommande)
  
        if (isEdit) {
          HandleupdateCommande(selectedCommande.id, newCommande);
        } else {
          addCommande(newCommande);
        }
      }
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
        header: "Commande ID",
        accessorKey: "id",
        enableColumnFilter: false,
        cell: (cell) => (
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 ms-2 name">{cell.getValue()}</div>
          </div>
        ),
      },
    {
      header: "Date Commande",
      accessorKey: "dateCommande",
      enableColumnFilter: false,
      cell: (cell) => (
        <div className="d-flex align-items-center">
          <div className="flex-grow-1 ms-2 name">{cell.getValue()}</div>
        </div>
      ),
    },

    {
      header: "Date Livraison",
      accessorKey: "dateLivraison",
      enableColumnFilter: false,
    },
    {
      header: "Status",
      //accessorKey: "unit",
      accessorKey: "status",
      enableColumnFilter: false,
    },
  
   
   /*{
      header: "Last Activity",
      //accessorKey: "last_activity",
      accessorKey: "lastActivity",
      enableColumnFilter: false,
      cell: (cell) => (
        <>
          {handleValidDate(cell.getValue()[0] || [])},{" "}
          <small className="text-muted">
            {handleValidTime(cell.getValue()[1])}
          </small>
        </>
      ),
    },*/
    // {
    //   header: "Last Activity",
    //   accessorKey: "lastActivity",
    //   enableColumnFilter: false,
    //   cell: (cell) => {
    //     const value = cell.getValue();
    //     if (value) {
    //       const [date, time] = value.split("T");
    //       return (
    //           <>
    //             {handleValidDate(date)},{" "}
    //             <small className="text-muted">
    //               {handleValidTime(time)}
    //             </small>
    //           </>
    //       );
    //     } else {
    //       return null;
    //     }
    //   },
    // },

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
                const CommandeData = cellProps.row.original;
                console.log("data",CommandeData)
                setInfo(CommandeData);
                console.log("info",info)
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
              onClick={() => handleCommandeClick(cellProps.row.original)}
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
                const CommandeData = cellProps.row.original;
                console.log("Commande date delte",CommandeData)
                onClickDelete(CommandeData);
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
      const allIds = Commandes.map((item) => item.id);
      setSelectedCheckBoxDelete(allIds);
      setIsMultiDeleteButton(true);
      console.log(allIds);
    } else {
      setSelectedCheckBoxDelete([]);
      setIsMultiDeleteButton(false);
    }
  }, [Commandes]);

  const deleteMultiple = useCallback(() => {
    setCommande((prevCommandes) => {
      const updatedCommandes = prevCommandes.filter(
        (c) => !selectedCheckBoxDelete.includes(c.id)
      );
      return updatedCommandes;
    });
    setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete([]);
    document.getElementById("checkBoxAll").checked = false;
    setDeleteModalMulti(false);
  }, [selectedCheckBoxDelete]);

  useEffect(() => {
    if (CommandeDeleted) {
      setCommandeToDelete(null);
      setCommandeDeleted(false);
    }
  }, [CommandeDeleted]);

  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={Commandes.map((Commande) => ({
            id: String(Commande.id),
            dateCommande: String(Commande.dateCommande),
            dateLivraison: String(Commande.dateLivraison),
            status: String(Commande.status),

          }))}
          headers={headers}
          filename={"Commandes"}
        />

        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCommande}
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
          <BreadCrumb title="Commandes" pageTitle="CRM" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="flex-grow-1">
                      <button
                        className="btn btn-info add-btn"
                        onClick={() => {
                          setModal(true);
                        }}
                      >
                        <i className="ri-add-fill me-1 align-bottom"></i>
                        Add Commandes
                      </button>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="hstack text-nowrap gap-2">
                        {/* :::::::::::::::::::::::::: DELETE MULTIPLE CLIENTS ::::::::::::::::::: */}
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
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>
            <Col xxl={12}>
              <Card id="contactList">
                <CardBody className="pt-0">
                  {/* :::::::::::::::::::::: LIST CLIENTS :::::::::::::::::::::::::: */}
                  {/*{Commandes && Commandes.length ? (*/}
                  {isLoiding  ? ( <Loader/> ) : (
                    <TableContainer
                      columns={columns}
                      data={Commandes || []}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={8}
                      className="custom-header-css"
                      divClass="table-responsive table-card mb-3"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light"
                      handleCommandeClick={handleCommandeClicks}
                      isCommandesFilter={true}
                      SearchPlaceholder="Search for Commandes..."
                    />
                    )}
            {/*      ) : (
                    <Loader />
                  )}
*/}
                  {/* :::::::::::::::::::::: ADD / UPDATE MODAL :::::::::::::::::::::::::: */}
                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-info-subtle p-3" toggle={toggle}>
          {!!isEdit ? "Edit Commande" : "Add Commande"}
        </ModalHeader>
        <Form
          className="tablelist-form"
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            console.log("Form values:", validation.values);
            console.log("Form errors:", validation.errors);
            return false;
          }}
        >
           <ModalBody>
      <Input type="hidden" id="id-field" />
      <Row className="g-3">
        <Col lg={12}>
       
                <Label className="form-label" htmlFor="client-select">
                  Client
                </Label>
                <Select
                  id="client_id"
                  options={cliyon}
                  onChange={(selectedOption) => {
                    setSelectedClient(selectedOption);
                    console.log("ss",selectedOption)
                    validation.setFieldValue('value', selectedOption ? selectedOption.value : '');
                  }}
                  value={selectedClient}
                  placeholder="Select a client"
                />
            
</Col>
        <Col lg={12}>
          <div>
          <Label className="form-label" htmlFor="dateCommande">
                  Date Commande
                </Label>
                <Input
                  id="dateCommande"
                  name="dateCommande"
                  type="date"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.dateCommande || ""}
                />
                {validation.touched.dateCommande &&
                validation.errors.dateCommande ? (
                  <FormFeedback type="invalid">
                    {validation.errors.dateCommande}
                  </FormFeedback>
                ) : null}
          </div>
        </Col>
        <Col lg={12}>
         
          <Label className="form-label" htmlFor="dateLivraison">
                  Date Livraison
                </Label>
                <Input
                  id="dateLivraison"
                  name="dateLivraison"
                  type="date"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.dateLivraison || ""}
                />
                {validation.touched.dateLivraison &&
                validation.errors.dateLivraison ? (
                  <FormFeedback type="invalid">
                    {validation.errors.dateLivraison}
                  </FormFeedback>
                ) : null}
        </Col>
        <Col lg={12}>

        <div >
                <Label className="form-label" htmlFor="status-select">
                  Status
                </Label>
                <Select
                  id="status-select"
                  options={statuses}
                  onChange={(selectedOption) => setStatus(selectedOption)}
                  value={status}
                  placeholder="Select a status"
                />
              </div>
              </Col>
       
        <Col lg={12}>
          <div>
            <Label htmlFor="matiere-premiere-field" className="form-label">Matiere Premiere</Label>
            <Select
              id="matiere-premiere-field"
              isMulti
              options={permis}
              onChange={handleProduitFiniChange}
              value={selectedProduitFinis}
              placeholder="Select Matiere Premiere"
              classNamePrefix="select"
            />
          </div>
        </Col>
        {selectedProduitFinis.map(mp => (
          <Col lg={12} key={mp.value}>
            <div>
              <Label htmlFor={`quantity-${mp.value}`} className="form-label">
                Quantity for {mp.label}
              </Label>
              <Input
                id={`quantity-${mp.value}`}
                type="number"
                min="0"
                placeholder="Enter Quantity"
                value={produitFiniQuantities[mp.value] || ""}
                onChange={(e) => handleProduitFiniQuantityChange(mp.value, e.target.value)}
              />
            </div>
          </Col>
        ))}
      </Row>
    </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setModal(false)}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-success"
                id="add-btn"
              >
                {!!isEdit ? "Update" : "Add Commande"}
              </button>
            </div>
          </ModalFooter>
        </Form>
      </Modal>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>

            {/* :::::::::::::::::::::: VIEW Commande :::::::::::::::::::::::::: */}
            <Modal
              id="viewModal"
              isOpen={viewModal}
              toggle={toggleViewModal}
              centered
            >
              <ModalHeader toggle={toggleViewModal}>View Commande</ModalHeader>
              <ModalBody>
                <div id="contact-view-detail">
                  <div className="text-center mb-3">
                    <h5 className="mt-4 mb-1">{info.id}</h5>
                    <p className="text-muted">{info.id}</p>

                    <ul className="list-inline mb-0">
                      <li className="list-inline-item avatar-xs">
                        <Link
                          to="#"
                          className="avatar-title bg-success-subtle text-success fs-15 rounded"
                        >
                          <i className="ri-unit-line"></i>
                        </Link>
                      </li>
                      <li className="list-inline-item avatar-xs">
                        <Link
                          to="#"
                          className="avatar-title bg-danger-subtle text-danger fs-15 rounded"
                        >
                          <i className="ri-mail-line"></i>
                        </Link>
                      </li>
                      <li className="list-inline-item avatar-xs">
                        <Link
                          to="#"
                          className="avatar-title bg-warning-subtle text-warning fs-15 rounded"
                        >
                          <i className="ri-question-answer-line"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="table-responsive table-card">
                      <Table className="table table-borderless mb-0">
                        <tbody>
                       
                        <tr>
                            <td className="fw-medium">Commande Number</td>
                            <td>{info.id || "tonyanoble@velzon.com"}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Date Commande</td>
                            <td>{info.dateCommande }</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Date Livraison</td>
                            <td>{info.dateLivraison}</td>
                          </tr>

                 
                    <tr>
                      <td className="fw-medium">Produit</td>
                      <td>
                        <Table className="table table-borderless mb-0">
                          <tbody>
                            {produitFiniDetails.map((mp, index) => (
                              <tr key={index}>
                                <td className="fw-medium">{mp.name}</td>
                                <td>{mp.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </td>
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
