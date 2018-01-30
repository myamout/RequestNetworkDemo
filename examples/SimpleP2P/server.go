package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.Logger())
	e.Static("/js", "./dist/js")
	e.Static("/polyfill", "./node_modules/@webcomponents/webcomponentsjs")
	e.Static("/css", "./node_modules/wingcss/dist")
	e.File("/", "dist/index.html")
	e.Logger.Fatal(e.Start(":3001"))
}
