package controller

import (
	"github.com/nitaxxix/sa-64-final/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// 7.ดึงข้อมูลด้วย ID GET /user/id

func GetUser(c *gin.Context) {

	var user entity.User

	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM users WHERE id = ? ", id).Scan(&user).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": user})

}


// GET /users

func ListUser(c *gin.Context) {

	var users []entity.User

	if err := entity.DB().Raw("SELECT * FROM users").Scan(&users).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": users})

}
