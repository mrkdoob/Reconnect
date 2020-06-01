import React from "react"
import { Flex } from "@chakra-ui/core"

import { AppProvider } from "../components/providers/AppProvider"
import { Navbar } from "../components/Navbar"
import { Courses } from "../pages/Courses"
import { Dashboard } from "../pages/Dashboard"
import { Router } from "@reach/router"
import { Course } from "../pages/Course"
import { Groups } from "../pages/Groups"
import { LevelReward } from "../pages/LevelReward"
import { Settings } from "../pages/Settings"
import { Progress } from "../pages/Progress"
import { Register } from "../pages/Register"
import { Login } from "../pages/Login"
import { CurrentLevelReward } from "../pages/CurrentLevelReward"
import { ResetPassword } from "../pages/ResetPassword"
import { Portfolio } from "../pages/Portfolio"
import { AdminCourse } from "../pages/AdminCourse"
import { AdminCourses } from "../pages/AdminCourses"

export function Application() {
  return (
    <AppProvider>
      <React.Suspense fallback={null}>
        {/* <CheckAuth> */}
        <Flex>
          <Navbar />
          <Router>
            <Dashboard path="/" />
            <Courses path="/courses" />
            <AdminCourses path="/admin-courses" />
            <Course path="/courses/:slug" />
            <AdminCourse path="/admin-courses/:slug" />
            <Groups path="/:slug/groups" />
            <LevelReward path="/levelreward/:levelId" />
            <CurrentLevelReward path="/mylevelreward" />
            <Settings path="/settings" />
            <Progress path="/progress" />
            <Register path="/register" />
            <Login path="/login" />
            <ResetPassword path="/reset-password/:token" />
            <Portfolio path="/portfolio" />
          </Router>
        </Flex>
        {/* </CheckAuth> */}
      </React.Suspense>
    </AppProvider>
  )
}
