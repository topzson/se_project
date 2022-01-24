package controller

import (
	"github.com/topzson/se_project/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// get /MedRec
func ListMedRecord(c *gin.Context) {
	var medRecord []entity.MedRecord
	if err := entity.DB().Preload("UserPharmacist").
		Preload("UserPharmacist.Role").
		Preload("MedicalProduct").
		Preload("Treatment").
		Preload("Treatment.Screening").
		Preload("Treatment.Screening.Patient").
		Raw("SELECT * FROM med_records").
		Find(&medRecord).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medRecord})
}

// POST /submit
func CreateMedRecord(c *gin.Context) {
	var medRecord entity.MedRecord
	var treatment entity.Treatment
	var pharmacist entity.User
	var medicalProduct entity.MedicalProduct

	if err := c.ShouldBindJSON(&medRecord); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 10.ค้นหา TreatmentRecord ด้วย id
	if err := entity.DB().Where("id = ?", medRecord.TreatmentID).First(&treatment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "TreatmentRecord not found"})
		return
	}
	// 11.ค้นหา MedicalProduct ด้วย id
	if err := entity.DB().Where("id = ?", medRecord.MedicalProductID).First(&medicalProduct).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "MedicalProduct not found"})
		return
	}

	// 12.ค้นหา User ด้วย id
	if tx := entity.DB().Where("id = ?", medRecord.UserPharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Pharmacist not found"})
		return
	}
	entity.DB().Joins("Role").Find(&pharmacist)

	//13.ต้องเป็น Pharmacist ถึงบันทึกได้
	if pharmacist.Role.Name != "Pharmacist" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only Pharmacist can save MedRecord !!"})
		return
	}

	// 14.สร้าง
	mr := entity.MedRecord{
		Treatment:      treatment,
		UserPharmacist: pharmacist,
		MedicalProduct: medicalProduct,
		Amount:         medRecord.Amount,
	}

	// 15.บันทึก
	if err := entity.DB().Create(&mr).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": mr})

}
