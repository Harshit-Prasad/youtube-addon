import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Login from "../components/cards/Login";
import Signup from "../components/cards/Signup";
import "react-tabs/style/react-tabs.css";
import { Link } from "react-router-dom";

export default function Auth() {
  return (
    <div className="h-dvh flex flex-col justify-center items-center">
      <div className="w-full max-w-[400px] p-4">
        <Link to="/">Home</Link>
        <Tabs>
          <TabList>
            <Tab>Sign up</Tab>
            <Tab>Login</Tab>
          </TabList>

          <TabPanel>
            <Signup />
          </TabPanel>
          <TabPanel>
            <Login />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
