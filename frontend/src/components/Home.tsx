
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

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

function Home() {
  const classes = useStyles();

  return (
    <div>
      <Container className={classes.container} maxWidth="md">
        <h1 style={{ textAlign: "center" }}>ระบบการจ่ายยาและเวชภัณฑ์</h1>
        <h4>Requirements</h4>
        <p>
        ระบบทันตกรรมของโรงพยาบาล เป็นระบบที่ให้เภสัชที่เป็นผู้ใช้ระบบสามารถ login 
        เข้าสู่ระบบเพื่อทำการบันทึกการจ่ายยาและเวชภัณฑ์ให้กับผู้ป่วยซึ่งอยู่ในข้อมูลเวชระเบียน 
        และจ่ายยาตามใบวินิฉัยของแพทย์ได้อย่างถูกต้อง สามารถดูข้อมูลว่าเคยมีประวัติการจ่ายยาอะไรมาบ้าง 
        นอกจากนั้นหากเภสัชวินิฉัยแล้วว่าผู้ป่วยไม่ควรได้รับยาหรือเวชภัณฑ์ตามใบวินิฉัยของแพทย์ 
        เภสัชสามารถแก้ไขรายการยาและเวชภัณฑ์ของผู้ป่วยได้ทันที
        </p>
      </Container>
    </div>
  );
}
export default Home;
