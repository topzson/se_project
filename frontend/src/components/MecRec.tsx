import React, { useEffect } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Box, Paper } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link as RouterLink } from "react-router-dom";
import { MedRecordInterface } from "../models/MedRecord";



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(2),
    },
    table: {
      minWidth: 650,
    },
    tableSpace: {
      marginTop: 20,
    },
  })
);


export default function MedRecord() {
    const classes = useStyles();

    const [medRec, setMecRec] = React.useState<MedRecordInterface[]>([]);
    const getMedRec = async() => {
        const apiUrl = "http://localhost:8080/MedRec";
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
                    setMecRec(res.data)
                } else {
                    console.log("else")
                }
            });
    }

    useEffect(() => {
        getMedRec();
    }, []);

    return (<div>
        <Container className={classes.container} maxWidth="md">
          <Box display="flex">
            <Box flexGrow={1}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                ข้อมูลการจ่ายยาและเวชภัภฑ์
              </Typography>
            </Box>
            <Box>
              <Button
                component={RouterLink}
                to="/CreateMecRecord"
                variant="contained"
                color="primary"
              >
                สร้างข้อมูล
              </Button>
            </Box>
          </Box>
          <TableContainer component={Paper} className={classes.tableSpace}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" width="10%">
                    ลำดับ
                  </TableCell>
                  <TableCell align="center" width="10%">
                    ใบวินิฉัย
                  </TableCell>
                  <TableCell align="center" width="20%">
                    ชื่อผู้จ่ายยาและเวชภัณฑ์
                  </TableCell>
                  <TableCell align="center" width="20%">
                    ชื่อคนรับยาและเวชภัณฑ์
                  </TableCell>
                  <TableCell align="center" width="20%">
                    รายการยาและเวชภัณฑ์
                  </TableCell>
                  <TableCell align="center" width="20%">
                    จำนวน
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medRec.map((item: MedRecordInterface) => (
                  <TableRow key={item.ID}>
                    <TableCell align="center">{item.ID}</TableCell>
                    <TableCell align="center">{item.Treatment.ID}</TableCell>
                    <TableCell align="center">{item.UserPharmacist.Name}</TableCell>
                    <TableCell align="center">{item.Treatment.Screening.Patient.Firstname} {item.Treatment.Screening.Patient.Lastname}</TableCell>
                    <TableCell align="center">{item.MedicalProduct.Name}</TableCell>
                    <TableCell align="center">{item.Amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </div>
    )
}
