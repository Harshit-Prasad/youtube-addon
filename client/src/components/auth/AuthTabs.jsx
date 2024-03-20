import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Login from "./Login";
import Signup from "./Signup";
import "react-tabs/style/react-tabs.css";
export default function AuthTabs({ pathname }) {
  return (
    <Tabs className="w-full max-w-[400px]">
      <TabList>
        <Tab>Sign up</Tab>
        <Tab>Login</Tab>
      </TabList>

      <TabPanel>
        <Signup pathname={pathname} />
      </TabPanel>
      <TabPanel>
        <Login pathname={pathname} />
      </TabPanel>
    </Tabs>
  );
}
