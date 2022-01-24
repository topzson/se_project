package main

import (
	"github.com/gin-gonic/gin"
	"github.com/topzson/se_project/controller"
	"github.com/topzson/se_project/entity"
	"github.com/topzson/se_project/middlewares"
)

func main() {

	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	api := r.Group("")
	{
		protected := api.Use(middlewares.Authorizes())
		{
			// Treatment
			protected.GET("/treatmentRecord", controller.ListTreatment)
			protected.GET("/treatmentRecord/:id", controller.GetTreatment)
			// MedicalProduct
			protected.GET("/medical_products", controller.ListMedicalProduct)
			// MedRecord
			protected.GET("/MedRec", controller.ListMedRecord)
			protected.POST("/submit", controller.CreateMedRecord)
			// User
			protected.GET("/users", controller.ListUser)
			protected.GET("/user/pharmacist/:id", controller.GetUser)
		}
	}
	// Authentication Routes
	r.POST("/login", controller.Login)

	// Run the server
	r.Run()

}

func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")

		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {

			c.AbortWithStatus(204)

			return

		}

		c.Next()

	}

}
