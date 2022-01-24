package controller

import (
	"github.com/nitaxxix/sa-64-final/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

//5.ดึงข้อมูลทั้งหมด  List /treatmentRecord
func ListTreatment(c *gin.Context) {
	var treatmentRecord []entity.Treatment
	if err := entity.DB().Preload("Screening").
		Preload("Screening.Patient").
		Find(&treatmentRecord).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": treatmentRecord})
}

//8. ค้นหาคนไข้ด้วยไอดี Ger /treatmentRecord/id
func GetTreatment(c *gin.Context) {
	var treatmentRecord entity.Treatment
	id := c.Param("id")
	if err := entity.DB().Preload("Screening").
	Preload("Screening.Patient").
	Raw("SELECT * FROM treatments WHERE id = ? ", id).Find(&treatmentRecord).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}
	c.JSON(http.StatusOK, gin.H{"data": treatmentRecord})

}
// POST /treatmentRecord
func CreateTreatment(context *gin.Context) {
	var treatmentRecord entity.Treatment

	var screening entity.Screening
	var dentist entity.User
	var remedy entity.RemedyType

	if err := context.ShouldBindJSON(&treatmentRecord); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", treatmentRecord.UserDentistID).First(&dentist); tx.RowsAffected == 0 {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Dentist not found"})
		return
	}

	entity.DB().Joins("Role").Find(&dentist)

	if dentist.Role.Name != "Dentist" {
		context.JSON(http.StatusBadRequest, gin.H{"error": "only for dentsit"})
		return
	}

	if tx := entity.DB().Where("id = ?", treatmentRecord.ScreeningID).First(&screening); tx.RowsAffected == 0 {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Screening not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", treatmentRecord.RemedyTypeID).First(&remedy); tx.RowsAffected == 0 {
		context.JSON(http.StatusBadRequest, gin.H{"error": "RemedyType not found"})
		return
	}

	treatmentData := entity.Treatment{
		PrescriptionRaw:  treatmentRecord.PrescriptionRaw,
		PrescriptionNote: treatmentRecord.PrescriptionNote,
		ToothNumber:      treatmentRecord.ToothNumber,
		Date:             treatmentRecord.Date,
		// create with assosiation
		Screening:   screening,
		UserDentist: dentist,
		RemedyType:  remedy,
	}

	if err := entity.DB().Create(&treatmentData).Error; err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"data": treatmentData})
}