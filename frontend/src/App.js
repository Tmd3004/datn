import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import { useContext, useState } from "react";
import { Store } from "./Store";
import DefaultLayout from "./components/DefaultLayout";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import ForgetPasswordScreen from "./screens/ForgetPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import InformationScreen from "./screens/InformationScreen/InformationScreen";
import TrainingProcessScreen from "./screens/TrainingProcessScreen/TrainingProcessScreen";
import WorkingProcessScreen from "./screens/WorkingProcessScreen/WorkingProcessScreen";
import ResearchProcessScreen from "./screens/ResearchProcessScreen/ResearchProcessScreen";
import PrizeScreen from "./screens/PrizeScreen/PrizeScreen";
import ViewAndPrintScreen from "./screens/ViewAndPrintScreen/ViewAndPrintScreen";
import ProgramScreen from "./screens/ProgramScreen/ProgramScreen";
import TopicStatusScreen from "./screens/TopicStatusScreen/TopicStatusScreen";
import ProgramSchoolScreen from "./screens/ProgramSchoolScreen/ProgramSchoolScreen";
import RegisterProgramScreen from "./screens/RegisterProgramScreen/RegisterProgramScreen";
import ConfirmTopic from "./screens/ConfirmTopicScreen/ConfirmTopicScreen";
import ReviewTopicScreen from "./screens/ReviewTopicScreen/ReviewTopicScreen";
import Chatbot from "./screens/Chatbot/Chatbot";


function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, userInfo } = state;
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  return (
    <BrowserRouter>
      <div>
        <header>{userInfo ? <DefaultLayout /> : ""}</header>

        <main
          style={{
            width: "100vw",
            backgroundColor: "#c8e9f0",
            paddingTop: userInfo ? "52px" : "0px",
          }}
        >
          <Routes>
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/forget-password" element={<ForgetPasswordScreen />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordScreen />}
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomeScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage_profile"
              element={
                <ProtectedRoute>
                  <InformationScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage_profile_1"
              element={
                <ProtectedRoute>
                  <TrainingProcessScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage_profile_2"
              element={
                <ProtectedRoute>
                  <WorkingProcessScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage_profile_3"
              element={
                <ProtectedRoute>
                  <ResearchProcessScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage_profile_4"
              element={
                <ProtectedRoute>
                  <PrizeScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage_profile_5"
              element={
                <ProtectedRoute>
                  <ViewAndPrintScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/program"
              element={
                <ProtectedRoute>
                  <ProtectedRoute>
                    <ProgramScreen />
                  </ProtectedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/track_topic_status"
              element={
                <ProtectedRoute>
                  <TopicStatusScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/topic_review"
              element={
                <ProtectedRoute>
                  <ReviewTopicScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/program/school"
              element={
                <ProtectedRoute>
                  <ProgramSchoolScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/program/school/:id"
              element={
                <ProtectedRoute>
                  <RegisterProgramScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/confirm-topic"
              element={
                <ProtectedRoute>
                  <ConfirmTopic />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <Chatbot />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
