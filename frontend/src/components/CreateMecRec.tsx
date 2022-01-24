import React, { useState, useEffect } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Box, Paper } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";
import { Link as RouterLink } from "react-router-dom";
import { MedicalProductInterface } from "../models/MedicalProduct";
import { TreatmentInterface } from "../models/Treatment";
import { UserInterface } from "../models/User";
import { MedRecordInterface } from "../models/MedRecord";

const useStyles = makeStyles((theme: Theme) =>

    createStyles({

        root: { flexGrow: 1 },

        container: { marginTop: theme.spacing(2) },

        paper: { padding: theme.spacing(2), color: theme.palette.text.secondary },

        table: { minWidth: 20 },

        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 200,
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },

    })

);
///... state ก่อนหนน้า
const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};
export default function CreateMecRecord() {
    const classes = useStyles();
    const [MedRecord, setMedRecord] = useState<Partial<MedRecordInterface>>({});
    const [medicalProduct, setmedicalProduct] = useState<MedicalProductInterface[]>([]);
    const [treatmentRecord, settreatmentRecord] = useState<TreatmentInterface[]>([]);
    const [patient, setpatient] = useState<TreatmentInterface>();
    const [user, setuser] = useState<UserInterface>();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [warning, setWarning] = useState(false);
    //SyntheticEvent เช็คเกิดการ reaction กับหน้าจอ
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        //click ด้านนอกแล้วแจ้งไม่หาย
        if (reason === "clickaway") {
            return;
        }
        setSuccess(false);
        setError(false);
        setWarning(false);

    };
    const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const name = event.target.name as keyof typeof MedRecord;
        setMedRecord({
            ...MedRecord,
            [name]: event.target.value,
        });
        if (event.target.name === "TreatmentID") {
            getpatient(event.target.value as number);
        }
    }
    const getmedicalProduct = async () => {
        const apiUrl = "http://localhost:8080/medical_products";
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    setmedicalProduct(res.data)
                } else {
                    console.log("else")
                }
            });
    }
    const gettreatmentRecord = async () => {
        const apiUrl = "http://localhost:8080/treatmentRecord";
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };

        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log("treatment", res.data);
                if (res.data) {
                    settreatmentRecord(res.data)
                } else {
                    console.log("else")
                }
            });
    }
    const getpatient = async (id: number) => {
        const apiUrl = `http://localhost:8080/treatmentRecord/${id}`;
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    setpatient(res.data)
                } else {
                    console.log("else")
                }
            });
    }
    const getuser = async () => {
        let uid = localStorage.getItem("uid")
        const apiUrl = `http://localhost:8080/user/pharmacist/${uid}`;
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    setuser(res.data)
                } else {
                    console.log("else")
                }
            });
    }
    function submit() {
        let data = {
            UserPharmacistID: Number(localStorage.getItem("uid")),
            Amount: Number(MedRecord.Amount),
            TreatmentID: MedRecord.TreatmentID,
            MedicalProductID: MedRecord.MedicalProductID,
        }
        if (data.Amount <= 0 || !data.Amount || !data.MedicalProductID || !data.TreatmentID) {
            setWarning(true)
        }
        else {
            const apiUrl = "http://localhost:8080/submit";
            const requestOptionsPost = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            };
            fetch(apiUrl, requestOptionsPost).then((response) => response.json()).then((res) => {
                if (res.data) {
                    console.log("บันทึกได้")
                    setSuccess(true);
                } else {
                    console.log("บันทึกไม่ได้")
                    setError(true);
                }
            });
        }
    }
    useEffect(() => {
        getmedicalProduct();
        gettreatmentRecord();
        getuser();
    }, []);
    return (
        <Container className={classes.container} maxWidth="md">
            <Snackbar open={success} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    บันทึกข้อมูลสำเร็จ
                </Alert>
            </Snackbar>
            <Snackbar open={error} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    บันทึกข้อมูลไม่สำเร็จ
                </Alert>
            </Snackbar>

            <Snackbar open={warning} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning">
                    กรุณากรอกข้อมูลให้ครบ หรือ กรอกข้อมูลให้ถูกต้อง
                </Alert>
            </Snackbar>

            <Paper className={classes.paper}>
                <Box display="flex">
                    <Box flexGrow={1}>
                        <Typography
                            component="h2"

                            variant="h6"

                            color="primary"

                            gutterBottom
                        >
                            ข้อมูลการบันทึกการจ่ายยาและเวชภัณฑ์
                        </Typography>

                    </Box>
                </Box>
                <Divider />


                <Grid container spacing={3} className={classes.root}>

                    <Grid item xs={12}>
                        <p>ชื่อผู้จ่ายยาและเวชภัณฑ์</p>
                        <Select
                            style={{ width: 400 }}
                            variant="outlined"
                            defaultValue={0}
                            value={user?.ID}
                            disabled
                        >
                            <MenuItem value={0}>{user?.Name}</MenuItem>
                        </Select>
                    </Grid>


                    <Grid item xs={12}>
                        <p>เลขใบวินิฉัย</p>
                        <Select
                            style={{ width: 400 }}
                            variant="outlined"
                            defaultValue={0}
                            value={MedRecord.TreatmentID}
                            onChange={handleChange}
                            inputProps={{ name: "TreatmentID" }}
                        >
                            <MenuItem value={0} key={0} disabled>เลือกเลขใบวินิฉัย</MenuItem>
                            {treatmentRecord.map((item: TreatmentInterface) => (
                                <MenuItem value={item.ID} key={item.ID}>
                                    {item.ID}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>



                    <Grid item xs={6}>
                        <p>ชื่อ</p>
                        <TextField placeholder="ชื่อผู้ป่วย" fullWidth variant="outlined" disabled value={patient?.Screening.Patient.Firstname} />
                    </Grid>
                    <Grid item xs={6}>
                        <p>นามสกุล</p>
                        <TextField placeholder="นามสกุลผู้ป่วย" fullWidth variant="outlined" disabled value={patient?.Screening.Patient.Lastname} />
                    </Grid>


                    <Grid item xs={6}>
                        <p>ชื่อยา</p>
                        <Select
                            fullWidth
                            variant="outlined"
                            defaultValue={0}
                            value={MedRecord.MedicalProductID}
                            onChange={handleChange}
                            inputProps={{ name: "MedicalProductID" }}

                        >
                            <MenuItem value={0} key={0} disabled>
                                เลือกรายการยาและเวชภัณฑ์
                            </MenuItem>

                            {medicalProduct.map((item: MedicalProductInterface) => (
                                <MenuItem value={item.ID} key={item.ID}>
                                    {item.Name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    <Grid item xs={6}>
                        <p>จำนวน</p>
                        <TextField
                            fullWidth
                            id="outlined-basic"
                            variant="outlined"
                            placeholder="กรอกจำนวน"
                            type="number"
                            value={MedRecord.Amount}
                            onChange={handleChange}
                            inputProps={{ name: "Amount" }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button component={RouterLink} to="/MedRecord" variant="contained">
                            กลับ
                        </Button>
                        <Button
                            style={{ float: "right" }}
                            onClick={submit}
                            variant="contained"
                            color="primary"
                        >
                            บันทึก
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}

